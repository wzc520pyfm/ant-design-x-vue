/**
 * Docs-only AbstractXRequestClass stand-in for the openai-node custom-request pattern.
 * Streams OpenAI Chat Completions–shaped SSE chunks via provider callbacks.
 * Does not import the real `openai` package or call the network.
 */
import {
  AbstractXRequestClass,
  type SSEFields,
  type XModelParams,
  type XRequestOptions,
} from 'ant-design-x-vue';

export type MockNodeOutput = Partial<Record<SSEFields, any>>;
export type MockNodeInput = XModelParams;

export class MockOpenAINodeRequest<
  Input extends MockNodeInput = MockNodeInput,
  Output extends MockNodeOutput = MockNodeOutput,
> extends AbstractXRequestClass<Input, Output> {
  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;
  private aborted = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private replyFor: (userText: string) => string;

  constructor(
    baseURL: string,
    options: XRequestOptions<Input, Output> = {},
    replyFor: (userText: string) => string = (text) =>
      `Local openai-node style mock for **${text.trim() || 'hello'}**. Replace run/abort with the real SDK.`,
  ) {
    super(baseURL, options);
    this.replyFor = replyFor;
  }

  get asyncHandler(): Promise<any> {
    return Promise.resolve();
  }

  get isTimeout() {
    return this._isTimeout;
  }

  get isStreamTimeout() {
    return this._isStreamTimeout;
  }

  get isRequesting() {
    return this._isRequesting;
  }

  get manual() {
    return true;
  }

  run(input?: Input) {
    const { callbacks } = this.options;
    this.aborted = false;
    this._isRequesting = true;

    const userText =
      typeof input?.messages?.[0]?.content === 'string' ? input.messages[0].content : '';
    const reply = this.replyFor(userText);
    const pieces = reply.match(/[\s\S]{1,18}/g) || [reply];
    const headers = new Headers({ 'content-type': 'text/event-stream' });
    const chunks: Output[] = [];
    let index = 0;

    const tick = () => {
      if (this.aborted) {
        this._isRequesting = false;
        callbacks?.onError?.(new DOMException('Request aborted', 'AbortError'));
        return;
      }
      if (index < pieces.length) {
        const chunk = {
          data: JSON.stringify({
            choices: [{ delta: { role: 'assistant', content: pieces[index] } }],
          }),
        } as Output;
        chunks.push(chunk);
        callbacks?.onUpdate?.(chunk, headers);
        index += 1;
        this.timer = setTimeout(tick, 30);
        return;
      }
      this._isRequesting = false;
      callbacks?.onSuccess?.(chunks, headers);
    };

    this.timer = setTimeout(tick, 20);
  }

  abort() {
    this.aborted = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this._isRequesting) {
      this._isRequesting = false;
      this.options.callbacks?.onError?.(new DOMException('Request aborted', 'AbortError'));
    }
  }
}
