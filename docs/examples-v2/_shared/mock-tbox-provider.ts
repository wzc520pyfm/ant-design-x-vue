/**
 * Docs-only Tbox stand-in. React playground uses `tbox-nodejs-sdk` (Node-only);
 * the browser docs cannot ship that SDK. This mock streams `{ text, ext_text }`
 * chunks matching React `TboxProvider.transformMessage` / bubble content shape.
 */
import {
  AbstractChatProvider,
  AbstractXRequestClass,
  type TransformMessage,
  type XRequestOptions,
} from 'ant-design-x-vue';

export interface TboxInput {
  message: {
    role: string;
    content: string;
  };
  userAction?: string;
}

export interface TboxOutput {
  text?: string;
  ext_text?: string;
}

export interface TboxMessage {
  content: TboxOutput | string;
  role: string;
}

export type MockTboxReply = {
  think: string;
  text: string;
};

export function defaultMockTboxReply(userText: string): MockTboxReply {
  const question = userText.trim() || 'hello';
  return {
    think: [
      `正在分析用户问题：「${question}」。`,
      '百宝箱文档页无法加载 tbox-nodejs-sdk，因此用本地流模拟 text + ext_text 载荷。',
      '思考完成后输出答复正文。',
    ].join('\n\n'),
    text: [
      `关于 **${question}**：`,
      '',
      '这是对齐 React 2.10 agent-tbox 的本地模拟回复。',
      '',
      '- `ext_text`：深度思考（写入 `<think>`）',
      '- `text`：助手正文',
      '',
      '`tbox-nodejs-sdk` 只能在 Node 里使用；接入真实百宝箱时替换 `MockTboxRequest` 即可。',
    ].join('\n'),
  };
}

export class MockTboxRequest<
  Input extends TboxInput = TboxInput,
  Output extends TboxOutput = TboxOutput,
> extends AbstractXRequestClass<Input, Output> {
  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;
  private aborted = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private replyFor: (userText: string) => MockTboxReply;

  constructor(
    baseURL: string,
    options: XRequestOptions<Input, Output> = {},
    replyFor: (userText: string) => MockTboxReply = defaultMockTboxReply,
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

  run(params?: Input) {
    const { callbacks } = this.options;
    this.aborted = false;
    this._isRequesting = true;

    const userText =
      typeof params?.message?.content === 'string' ? params.message.content : '';
    const { think, text } = this.replyFor(userText);
    const thinkPieces = think.match(/[\s\S]{1,28}/g) || [think];
    const textPieces = text.match(/[\s\S]{1,22}/g) || [text];
    const headers = new Headers({ 'content-type': 'application/json' });
    const chunks: Output[] = [];
    let phase: 'think' | 'text' | 'done' = 'think';
    let index = 0;

    const tick = () => {
      if (this.aborted) {
        this._isRequesting = false;
        callbacks?.onError?.(new DOMException('Request aborted', 'AbortError'));
        return;
      }

      if (phase === 'think') {
        if (index < thinkPieces.length) {
          const chunk = { ext_text: thinkPieces[index] } as Output;
          chunks.push(chunk);
          callbacks?.onUpdate?.(chunk, headers);
          index += 1;
          this.timer = setTimeout(tick, 28);
          return;
        }
        phase = 'text';
        index = 0;
        this.timer = setTimeout(tick, 28);
        return;
      }

      if (phase === 'text') {
        if (index < textPieces.length) {
          const chunk = { text: textPieces[index] } as Output;
          chunks.push(chunk);
          callbacks?.onUpdate?.(chunk, headers);
          index += 1;
          this.timer = setTimeout(tick, 28);
          return;
        }
        phase = 'done';
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

export class MockTboxProvider<
  ChatMessage extends TboxMessage = TboxMessage,
  Input extends TboxInput = TboxInput,
  Output extends TboxOutput = TboxOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output, ChatMessage>,
  ): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    if (requestParams.userAction === 'retry') {
      const messages = this.getMessages();
      const queryMessage = [...(messages || [])].reverse().find((item) => item?.role === 'user');
      const content =
        typeof queryMessage?.content === 'string'
          ? queryMessage.content
          : '';
      return {
        message: { role: 'user', content },
        ...(options?.params || {}),
        ...(requestParams || {}),
      } as Input;
    }

    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
    } as Input;
  }

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return requestParams.message as unknown as ChatMessage;
  }

  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info || {};
    if (!chunk) {
      const originContent =
        originMessage && typeof originMessage.content === 'object'
          ? originMessage.content
          : {};
      return {
        content: originContent || {},
        role: 'assistant',
      } as ChatMessage;
    }

    const content =
      originMessage && typeof originMessage.content === 'object'
        ? (originMessage.content as TboxOutput)
        : {};
    return {
      content: {
        text: (content.text || '') + (chunk.text || ''),
        ext_text: (content.ext_text || '') + (chunk.ext_text || ''),
      },
      role: 'assistant',
    } as ChatMessage;
  }
}

/** One MockTboxProvider per conversation key (React Tbox providerFactory parity). */
export function createTboxProviderFactory(
  replyFor: (userText: string) => MockTboxReply = defaultMockTboxReply,
) {
  const caches = new Map<string, MockTboxProvider>();

  const factory = (conversationKey: string) => {
    const key = conversationKey || 'default';
    let provider = caches.get(key);
    if (!provider) {
      provider = new MockTboxProvider({
        request: new MockTboxRequest('Tbox Mock Client', {}, replyFor),
      });
      caches.set(key, provider);
    }
    return provider;
  };

  factory.caches = caches;
  return factory as ((conversationKey: string) => MockTboxProvider) & {
    caches: Map<string, MockTboxProvider>;
  };
}

/**
 * Stable provider for Vue `useXChat` (setup once).
 * Delegates to the per-conversation cached provider from `getConversationKey()`.
 */
export function createLiveTboxProvider(
  getConversationKey: () => string,
  replyFor: (userText: string) => MockTboxReply = defaultMockTboxReply,
): MockTboxProvider {
  const factory = createTboxProviderFactory(replyFor);
  const getMessagesFns = new Set<() => any>();

  const current = () => {
    const provider = factory(getConversationKey());
    getMessagesFns.forEach((fn) => provider.injectGetMessages(fn));
    return provider;
  };

  const seed = factory('__playground_tbox_seed__');

  const requestFacade = {
    get manual() {
      return current().request.manual;
    },
    get options() {
      return current().request.options;
    },
    get baseURL() {
      return (current().request as any).baseURL;
    },
    get isRequesting() {
      return current().request.isRequesting;
    },
    get asyncHandler() {
      return (current().request as any).asyncHandler;
    },
    abort(...args: any[]) {
      return (current().request.abort as any)(...args);
    },
    run(...args: any[]) {
      return (current().request.run as any)(...args);
    },
  };

  return new Proxy(seed, {
    get(_target, prop) {
      if (prop === 'request') {
        return requestFacade;
      }
      if (prop === 'injectGetMessages') {
        return (fn: () => any) => {
          getMessagesFns.add(fn);
          current().injectGetMessages(fn);
        };
      }
      const provider = current();
      const value = (provider as any)[prop];
      return typeof value === 'function' ? value.bind(provider) : value;
    },
  }) as MockTboxProvider;
}
