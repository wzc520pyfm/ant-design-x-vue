import type { AnyObject } from '../../_util/type';
import {
  AbstractXRequestClass,
  type XRequestCallbacks,
  type XRequestOptions,
} from '../../x-request';
import type { MessageStatus } from '../index';

export interface ChatProviderConfig<Input, Output> extends AnyObject {
  request: AbstractXRequestClass<Input, Output> | (() => AbstractXRequestClass<Input, Output>);
}

export interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders: Headers;
}

export default abstract class AbstractChatProvider<ChatMessage, Input, Output> {
  private _request!: AbstractXRequestClass<Input, Output>;
  private _getMessagesFn!: () => ChatMessage[];
  private _originalCallbacks?: XRequestCallbacks<Output>;

  public get request() {
    return this._request;
  }

  constructor(config: ChatProviderConfig<Input, Output>) {
    const request = typeof config.request === 'function' ? config.request() : config.request;
    if (!request.manual) {
      throw new Error('request must be manual');
    }
    this._request = request;
    this._originalCallbacks = this._request.options?.callbacks;
  }

  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
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
    onUpdate: (data: Output, responseHeaders: Headers) => void;
    onSuccess: (data: Output[], responseHeaders: Headers) => void;
    onError: (error: any) => void;
  }) {
    const originalOnUpdate = this._originalCallbacks?.onUpdate;
    const originalOnSuccess = this._originalCallbacks?.onSuccess;
    const originalOnError = this._originalCallbacks?.onError;
    this._request.options.callbacks = {
      onUpdate: (data: Output, responseHeaders: Headers) => {
        onUpdate(data, responseHeaders);
        if (originalOnUpdate) originalOnUpdate(data, responseHeaders);
      },
      onSuccess: (data: Output[], responseHeaders: Headers) => {
        onSuccess(data, responseHeaders);
        if (originalOnSuccess) originalOnSuccess(data, responseHeaders);
      },
      onError: (error) => {
        onError(error);
        if (originalOnError) originalOnError(error);
      },
    } as XRequestCallbacks<Output>;
  }
}

export { AbstractChatProvider };
