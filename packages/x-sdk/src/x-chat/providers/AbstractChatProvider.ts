import type { AnyObject } from '../../_util/type';
import {
  AbstractXRequestClass,
  type XRequestCallbacks,
  type XRequestOptions,
} from '../../x-request';
import type { MessageInfo, MessageStatus, SimpleType } from '../index';

export interface ChatProviderConfig<
  Input,
  Output,
  ChatMessage extends SimpleType = any,
> extends AnyObject {
  request:
    | AbstractXRequestClass<Input, Output, ChatMessage>
    | (() => AbstractXRequestClass<Input, Output, ChatMessage>);
}

export interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders: Headers;
}

export default abstract class AbstractChatProvider<
  ChatMessage extends SimpleType,
  Input,
  Output,
> {
  private _request!: AbstractXRequestClass<Input, Output, ChatMessage>;
  private _getMessagesFn!: () => ChatMessage[];
  private _originalCallbacks?: XRequestCallbacks<Output, ChatMessage>;

  public get request() {
    return this._request;
  }

  constructor(config: ChatProviderConfig<Input, Output, ChatMessage>) {
    const request = typeof config.request === 'function' ? config.request() : config.request;
    if (!request.manual) {
      throw new Error('request must be manual');
    }
    this._request = request;
    this._originalCallbacks = this._request.options?.callbacks;
  }

  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output, ChatMessage>,
  ): Input;

  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage | ChatMessage[];

  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;

  getMessages(): ChatMessage[] {
    return this?._getMessagesFn();
  }

  injectGetMessages(getMessages: () => ChatMessage[]) {
    this._getMessagesFn = getMessages;
  }

  injectRequest({
    onUpdate,
    onSuccess,
    onError,
  }: {
    onUpdate: (
      data: Output,
      responseHeaders: Headers,
    ) => MessageInfo<ChatMessage> | void;
    onSuccess: (
      data: Output[],
      responseHeaders: Headers,
    ) => MessageInfo<ChatMessage> | void;
    onError: (
      error: any,
      errorInfo?: any,
    ) => ChatMessage | Promise<ChatMessage | void> | void;
  }) {
    const originalOnUpdate = this._originalCallbacks?.onUpdate;
    const originalOnSuccess = this._originalCallbacks?.onSuccess;
    const originalOnError = this._originalCallbacks?.onError;
    this._request.options.callbacks = {
      onUpdate: (data: Output, responseHeaders: Headers) => {
        const msg = onUpdate(data, responseHeaders);
        if (originalOnUpdate) originalOnUpdate(data, responseHeaders, msg || undefined);
      },
      onSuccess: (data: Output[], responseHeaders: Headers) => {
        const msg = onSuccess(data, responseHeaders);
        if (originalOnSuccess) originalOnSuccess(data, responseHeaders, msg || undefined);
      },
      onError: (error, errorInfo, responseHeaders) => {
        const fallbackMsg = onError(error, errorInfo);
        if (fallbackMsg && typeof (fallbackMsg as Promise<ChatMessage>).then === 'function') {
          void (fallbackMsg as Promise<ChatMessage>).then((msg) => {
            originalOnError?.(
              error,
              errorInfo,
              responseHeaders,
              msg as MessageInfo<ChatMessage>,
            );
          });
          return;
        }
        const retryInterval = originalOnError?.(
          error,
          errorInfo,
          responseHeaders,
          fallbackMsg as MessageInfo<ChatMessage>,
        );
        return typeof retryInterval === 'number' ? retryInterval : undefined;
      },
    } as XRequestCallbacks<Output, ChatMessage>;
  }
}

export { AbstractChatProvider };
