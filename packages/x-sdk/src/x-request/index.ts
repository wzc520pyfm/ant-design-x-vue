import type { AnyObject } from '../_util/type';
import type { JSONOutPut, SSEOutput, XReadableStream, XStreamOptions } from '../x-stream';
import XStream from '../x-stream';
import type { XFetchMiddlewares } from './x-fetch';
import xFetch from './x-fetch';

export interface XRequestCallbacks<Output> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunks: Output[], responseHeaders: Headers) => void;
  /**
   * @description Callback when the request fails
   */
  onError: (error: Error) => void;
  /**
   * @description Callback when the request is updated (per chunk)
   */
  onUpdate?: (chunk: Output, responseHeaders: Headers) => void;
}

export interface XRequestOptions<Input = AnyObject, Output = SSEOutput> extends RequestInit {
  callbacks?: XRequestCallbacks<Output>;
  params?: Input;
  headers?: Record<string, string>;
  timeout?: number;
  streamTimeout?: number;
  fetch?: (
    baseURL: Parameters<typeof fetch>[0],
    options: XRequestOptions<Input, Output>,
  ) => Promise<Response>;
  middlewares?: XFetchMiddlewares<Input, Output>;
  transformStream?:
    | XStreamOptions<Output>['transformStream']
    | ((baseURL: string, responseHeaders: Headers) => XStreamOptions<Output>['transformStream']);
  manual?: boolean;
}

export type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream' | 'manual'
>;

export type XRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  baseURL: string,
  options?: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;

const globalOptions: XRequestGlobalOptions<AnyObject, AnyObject> = {
  manual: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

export function setXRequestGlobalOptions<Input, Output>(
  options: XRequestGlobalOptions<Input, Output>,
) {
  Object.assign(globalOptions, options);
}

export abstract class AbstractXRequestClass<Input, Output> {
  baseURL!: string;
  options!: XRequestOptions<Input, Output>;

  constructor(baseURL: string, options?: XRequestOptions<Input, Output>) {
    if (!baseURL || typeof baseURL !== 'string') throw new Error('The baseURL is not valid!');
    this.baseURL = baseURL;
    this.options = options || {};
  }

  abstract get asyncHandler(): Promise<any>;
  abstract get isTimeout(): boolean;
  abstract get isStreamTimeout(): boolean;
  abstract get isRequesting(): boolean;
  abstract get manual(): boolean;

  abstract run(params?: Input): void;
  abstract abort(): void;
}

export class XRequestClass<Input = AnyObject, Output = SSEOutput> extends AbstractXRequestClass<
  Input,
  Output
> {
  private _asyncHandler!: Promise<any>;

  private timeoutHandler: any = 0;
  private _isTimeout = false;
  private streamTimeoutHandler: any = 0;
  private _isStreamTimeout = false;
  private abortController!: AbortController;
  private _isRequesting = false;
  private _manual = false;

  public get asyncHandler() {
    return this._asyncHandler;
  }

  public get isTimeout() {
    return this._isTimeout;
  }

  private set isTimeout(value: boolean) {
    this._isTimeout = value;
  }

  public get isStreamTimeout() {
    return this._isStreamTimeout;
  }

  private set isStreamTimeout(value: boolean) {
    this._isStreamTimeout = value;
  }

  public get isRequesting() {
    return this._isRequesting;
  }

  public get manual() {
    return this._manual;
  }

  constructor(baseURL: string, options?: XRequestOptions<Input, Output>) {
    super(baseURL, options);
    this._manual = options?.manual || false;
    if (!this.manual) {
      this.init();
    }
  }

  public run(params?: Input) {
    if (this.manual) {
      this.init(params as Partial<Input>);
    } else {
      console.warn('The request is not manual, so it cannot be run!');
    }
  }

  public abort() {
    clearTimeout(this.timeoutHandler);
    clearTimeout(this.streamTimeoutHandler);
    this.abortController?.abort();
  }

  private init(extraParams?: Partial<Input>) {
    this.abortController = new AbortController();
    const {
      callbacks,
      params,
      headers = {},
      transformStream,
      fetch,
      timeout,
      streamTimeout,
      middlewares,
      ...otherOptions
    } = this.options;
    const requestInit: XRequestOptions<Input, Output> = {
      ...otherOptions,
      method: (otherOptions as RequestInit).method || 'POST',
      body: (otherOptions as RequestInit).body ?? JSON.stringify({
        ...params,
        ...(extraParams || {}),
      }),
      params: {
        ...params,
        ...extraParams,
      } as Input,
      headers: Object.assign({}, globalOptions.headers || {}, headers),
      signal: this.abortController.signal,
      middlewares,
    };
    if (timeout && timeout > 0) {
      this.timeoutHandler = setTimeout(() => {
        this.isTimeout = true;
        this.finishRequest();
        callbacks?.onError?.(new Error('TimeoutError'));
      }, timeout);
    }
    this.startRequest();
    this._asyncHandler = xFetch<Input, Output>(this.baseURL, {
      fetch,
      ...requestInit,
    })
      .then(async (response) => {
        clearTimeout(this.timeoutHandler);

        if (this.isTimeout) return;

        if (transformStream) {
          let transformer = transformStream as XStreamOptions<Output>['transformStream'];
          if (typeof transformStream === 'function') {
            transformer = transformStream(this.baseURL, response.headers);
          }
          await this.customResponseHandler<Output>(response, callbacks, transformer, streamTimeout);
          return;
        }
        const contentType = response.headers.get('content-type') || '';
        const mimeType = contentType.split(';')[0].trim();
        switch (mimeType) {
          case 'text/event-stream':
            await this.sseResponseHandler<Output>(response, callbacks, streamTimeout);
            break;
          case 'application/json':
            await this.jsonResponseHandler<Output>(response, callbacks);
            break;
          default:
            throw new Error(`The response content-type: ${contentType} is not support!`);
        }
      })
      .catch((error) => {
        clearTimeout(this.timeoutHandler);
        this.finishRequest();
        const err =
          error instanceof Error || (typeof DOMException !== 'undefined' && error instanceof DOMException)
            ? error
            : new Error('Unknown error!');
        callbacks?.onError?.(err);
      });
  }

  private startRequest() {
    this._isRequesting = true;
  }

  private finishRequest() {
    this._isRequesting = false;
  }

  private customResponseHandler = async <O = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<O>,
    transformStream?: XStreamOptions<O>['transformStream'],
    streamTimeout?: number | undefined,
  ) => {
    const stream = XStream<O>({
      readableStream: response.body!,
      transformStream,
    });
    await this.processStream<O>(stream, response, callbacks, streamTimeout);
  };

  private sseResponseHandler = async <O = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<O>,
    streamTimeout?: number,
  ) => {
    const stream = XStream<O>({
      readableStream: response.body!,
    });
    await this.processStream<O>(stream, response, callbacks, streamTimeout);
  };

  private async processStream<O>(
    stream: XReadableStream<O>,
    response: Response,
    callbacks?: XRequestCallbacks<O>,
    streamTimeout?: number,
  ) {
    const chunks: O[] = [];
    const iterator = stream[Symbol.asyncIterator]();
    let result: IteratorResult<O, any>;
    do {
      if (streamTimeout) {
        this.streamTimeoutHandler = setTimeout(() => {
          this.isStreamTimeout = true;
          this.finishRequest();
          callbacks?.onError?.(new Error('StreamTimeoutError'));
        }, streamTimeout);
      }
      result = await iterator.next();
      if (result.value !== undefined) {
        chunks.push(result.value);
        callbacks?.onUpdate?.(result.value, response.headers);
      }
      clearTimeout(this.streamTimeoutHandler);
      if (this.isStreamTimeout) {
        break;
      }
    } while (!result.done);
    if (streamTimeout) {
      clearTimeout(this.streamTimeoutHandler);
      if (this.isStreamTimeout) {
        this.finishRequest();
        return;
      }
    }
    this.finishRequest();
    callbacks?.onSuccess?.(chunks, response.headers);
  }

  private jsonResponseHandler = async <O = JSONOutPut>(
    response: Response,
    callbacks?: XRequestCallbacks<O>,
  ) => {
    const chunk: O = await response.json();

    if ((chunk as unknown as JSONOutPut)?.success === false) {
      const j = chunk as unknown as JSONOutPut;
      const error = new Error(j.message || 'System error');
      error.name = j.name || 'SystemError';
      callbacks?.onError?.(error);
    } else {
      callbacks?.onUpdate?.(chunk, response.headers);
      this.finishRequest();
      callbacks?.onSuccess?.([chunk], response.headers);
    }
  };
}

function XRequest<Input = AnyObject, Output = SSEOutput>(
  baseURL: string,
  options?: XRequestOptions<Input, Output>,
): AbstractXRequestClass<Input, Output> {
  return new XRequestClass<Input, Output>(baseURL, options);
}

export default XRequest;
export { XRequest };
export type { XFetchMiddlewares } from './x-fetch';
