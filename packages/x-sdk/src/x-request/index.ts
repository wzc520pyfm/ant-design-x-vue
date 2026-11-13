import type { AnyObject } from '../_util/type';
import type { MessageInfo, SimpleType } from '../x-chat';
import type {
  JSONOutPut,
  SSEOutput,
  XReadableStream,
  XStreamOptions,
} from '../x-stream';
import XStream from '../x-stream';
import type { XFetchMiddlewares } from './x-fetch';
import xFetch from './x-fetch';

export interface XRequestCallbacks<
  Output,
  ChatMessage extends SimpleType = any,
> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (
    chunks: Output[],
    responseHeaders: Headers,
    chatMessage?: MessageInfo<ChatMessage>,
  ) => void;
  /**
   * @description Callback when the request fails
   * @returns A retry interval in milliseconds, or void
   */
  onError: (
    error: Error,
    errorInfo?: any,
    responseHeaders?: Headers,
    fallbackMsg?: MessageInfo<ChatMessage>,
  ) => number | void;
  /**
   * @description Callback when the request is updated (per chunk)
   */
  onUpdate?: (
    chunk: Output,
    responseHeaders: Headers,
    chatMessage?: MessageInfo<ChatMessage>,
  ) => void;
}

export interface XRequestOptions<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> extends RequestInit {
  callbacks?: XRequestCallbacks<Output, ChatMessage>;
  params?: Partial<Input>;
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
    | ((
        baseURL: string,
        responseHeaders: Headers,
      ) => XStreamOptions<Output>['transformStream']);
  /**
   * @description Separator between stream events
   * @default "\n\n"
   */
  streamSeparator?: string;
  /**
   * @description Separator between fields in one stream event
   * @default "\n"
   */
  partSeparator?: string;
  /**
   * @description Separator between a field name and its value
   * @default ":"
   */
  kvSeparator?: string;
  manual?: boolean;
  /**
   * @description Retry interval after a request fails, in milliseconds
   */
  retryInterval?: number;
  /**
   * @description Maximum retry count; works with retryInterval or an onError return value
   */
  retryTimes?: number;
}

export type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'manual'
> & {
  /**
   * Global transform factory. Called once per request so overlapping requests
   * never share (and lock) the same TransformStream instance.
   */
  transformStream?: (
    baseURL: string,
    responseHeaders: Headers,
  ) => XStreamOptions<Output>['transformStream'];
};

export type XRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  baseURL: string,
  options?: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;

const LastEventId = 'Last-Event-ID';

/**
 * Merge header maps case-insensitively; later sources win. Keeping a single
 * casing variant avoids fetch combining values such as `application/json` and
 * `text/plain` for the same header.
 */
function mergeHeaders(
  ...sources: Array<Record<string, string> | undefined>
): Record<string, string> {
  const merged: Record<string, string> = {};
  const canonical = new Map<string, string>();
  for (const source of sources) {
    if (!source) continue;
    for (const [name, value] of Object.entries(source)) {
      const lower = name.toLowerCase();
      const previous = canonical.get(lower);
      if (previous && previous !== name) {
        delete merged[previous];
      }
      merged[name] = value;
      canonical.set(lower, name);
    }
  }
  return merged;
}

const globalOptions: XRequestGlobalOptions<AnyObject, AnyObject> = {
  manual: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

export function setXRequestGlobalOptions<Input, Output>(
  options: XRequestGlobalOptions<Input, Output>,
) {
  const { headers, transformStream, ...rest } = options;
  Object.assign(globalOptions, rest);
  if (headers) {
    // Merge instead of replacing so the default Content-Type survives.
    globalOptions.headers = mergeHeaders(globalOptions.headers, headers);
  }
  if (transformStream) {
    if (typeof transformStream === 'function') {
      globalOptions.transformStream = transformStream as XRequestGlobalOptions<
        AnyObject,
        AnyObject
      >['transformStream'];
    } else {
      console.warn(
        'The global transformStream option must be a factory returning a fresh TransformStream per request.',
      );
    }
  }
}

export abstract class AbstractXRequestClass<
  Input,
  Output,
  ChatMessage extends SimpleType = any,
> {
  baseURL!: string;
  options!: XRequestOptions<Input, Output, ChatMessage>;

  constructor(
    baseURL: string,
    options?: XRequestOptions<Input, Output, ChatMessage>,
  ) {
    if (!baseURL || typeof baseURL !== 'string')
      throw new Error('The baseURL is not valid!');
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

export class XRequestClass<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> extends AbstractXRequestClass<Input, Output, ChatMessage> {
  private _asyncHandler!: Promise<any>;

  private timeoutHandler: any = 0;
  private _isTimeout = false;
  private streamTimeoutHandler: any = 0;
  private _isStreamTimeout = false;
  private abortController!: AbortController;
  private _isRequesting = false;
  private _manual = false;
  private lastManualParams?: Partial<Input>;
  private retryTimes = 0;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private lastEventId: any;
  /** Monotonic id; callbacks from older requests are ignored. */
  private requestGeneration = 0;

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

  constructor(
    baseURL: string,
    options?: XRequestOptions<Input, Output, ChatMessage>,
  ) {
    super(baseURL, options);
    this._manual = options?.manual ?? globalOptions.manual ?? false;
    if (!this.manual) {
      this.init();
    }
  }

  public run(params?: Input) {
    if (this.manual) {
      this.resetRetry();
      this.lastManualParams = params;
      this.init(params as Partial<Input>);
      return true;
    } else {
      console.warn('The request is not manual, so it cannot be run!');
      return false;
    }
  }

  public abort() {
    clearTimeout(this.timeoutHandler);
    clearTimeout(this.streamTimeoutHandler);
    clearTimeout(this.retryTimer);
    this.abortController?.abort();
  }

  private init(
    extraParams?: Partial<Input>,
    extraHeaders?: Record<string, string>,
  ) {
    const generation = ++this.requestGeneration;
    const previousController = this.abortController;
    const controller = new AbortController();
    this.abortController = controller;
    const { signal } = controller;
    // Cancel the previous in-flight request before starting a new one.
    previousController?.abort();
    // An abort listener may synchronously start a newer request; stop here so
    // this stale init does not clear or overwrite that request's timers/handler.
    if (generation !== this.requestGeneration) return;
    clearTimeout(this.timeoutHandler);
    clearTimeout(this.streamTimeoutHandler);
    this.isTimeout = false;
    this.isStreamTimeout = false;

    const {
      callbacks,
      params,
      headers = {},
      transformStream: optionTransformStream,
      fetch: optionFetch,
      timeout: optionTimeout,
      streamTimeout: optionStreamTimeout,
      middlewares: optionMiddlewares,
      streamSeparator,
      partSeparator,
      kvSeparator,
      ...otherOptions
    } = this.options;
    const timeout = optionTimeout ?? globalOptions.timeout;
    const streamTimeout = optionStreamTimeout ?? globalOptions.streamTimeout;
    const fetch =
      optionFetch ??
      (globalOptions.fetch as XRequestOptions<Input, Output>['fetch']);
    const middlewares =
      optionMiddlewares ??
      (globalOptions.middlewares as XRequestOptions<
        Input,
        Output
      >['middlewares']);
    const globalTransformStream =
      typeof globalOptions.transformStream === 'function'
        ? globalOptions.transformStream
        : undefined;
    const transformStream =
      optionTransformStream ??
      (globalTransformStream as XRequestOptions<
        Input,
        Output
      >['transformStream']);
    const mergedHeaders = mergeHeaders(
      globalOptions.headers,
      headers,
      extraHeaders,
    );
    const requestInit: XRequestOptions<Input, Output> = {
      ...otherOptions,
      method: (otherOptions as RequestInit).method || 'POST',
      body:
        (otherOptions as RequestInit).body ??
        JSON.stringify({
          ...params,
          ...(extraParams || {}),
        }),
      params: {
        ...params,
        ...extraParams,
      } as Input,
      headers: mergedHeaders,
      signal,
      middlewares,
    };
    let timeoutHandler: ReturnType<typeof setTimeout> | undefined;
    if (timeout && timeout > 0) {
      timeoutHandler = setTimeout(() => {
        if (generation !== this.requestGeneration) return;
        this.isTimeout = true;
        this.finishRequest();
        // Abort this request's own controller before notifying the app:
        // `onError` may synchronously start a new request, and that request
        // must not be aborted by this stale timeout.
        controller.abort();
        callbacks?.onError?.(new Error('TimeoutError'));
      }, timeout);
      this.timeoutHandler = timeoutHandler;
    }
    this.startRequest();
    this._asyncHandler = xFetch<Input, Output>(this.baseURL, {
      fetch,
      ...requestInit,
    })
      .then(async (response) => {
        clearTimeout(timeoutHandler);
        if (generation !== this.requestGeneration) return;

        if (this.isTimeout) return;

        if (transformStream) {
          let transformer =
            transformStream as XStreamOptions<Output>['transformStream'];
          if (typeof transformStream === 'function') {
            transformer = transformStream(this.baseURL, response.headers);
          }
          await this.customResponseHandler<Output, ChatMessage>(
            response,
            callbacks,
            transformer,
            streamTimeout,
            streamSeparator,
            partSeparator,
            kvSeparator,
            signal,
            generation,
          );
          return;
        }
        const contentType = response.headers.get('content-type') || '';
        const mimeType = contentType.split(';')[0].trim();
        switch (mimeType) {
          case 'text/event-stream':
            await this.sseResponseHandler<Output, ChatMessage>(
              response,
              callbacks,
              streamTimeout,
              streamSeparator,
              partSeparator,
              kvSeparator,
              signal,
              generation,
            );
            break;
          case 'application/json':
            await this.jsonResponseHandler<Output, ChatMessage>(
              response,
              signal,
              callbacks,
              generation,
            );
            break;
          default:
            throw new Error(
              `The response content-type: ${contentType} is not support!`,
            );
        }
      })
      .catch((error) => {
        clearTimeout(timeoutHandler);
        // A newer request superseded this one: drop its late callbacks/retries.
        if (generation !== this.requestGeneration) return;
        if (this.isTimeout) {
          this.finishRequest();
          return;
        }
        if (this.isStreamTimeout) {
          this.finishRequest();
          return;
        }
        if (signal === this.abortController.signal) {
          this.finishRequest();
        }
        const err =
          error instanceof Error ||
          (typeof DOMException !== 'undefined' && error instanceof DOMException)
            ? error
            : new Error('Unknown error!');
        const retryInterval = callbacks?.onError?.(err);
        // `onError` may synchronously start a newer request. Do not let this
        // superseded request schedule a retry or mutate the new request.
        if (generation !== this.requestGeneration) return;
        if (err.name !== 'AbortError') {
          const interval =
            typeof retryInterval === 'number'
              ? retryInterval
              : this.options.retryInterval;
          if (interval && interval > 0) {
            if (
              typeof this.options.retryTimes === 'number' &&
              this.retryTimes >= this.options.retryTimes
            ) {
              return;
            }
            clearTimeout(this.retryTimer);
            this.retryTimer = setTimeout(() => {
              const extraHeaders: Record<string, string> = {};
              if (typeof this.lastEventId !== 'undefined') {
                extraHeaders[LastEventId] = this.lastEventId;
              }
              this.init(this.lastManualParams, extraHeaders);
            }, interval);
            this.retryTimes += 1;
          }
        }
      });
  }

  private startRequest() {
    this._isRequesting = true;
  }

  private finishRequest() {
    this._isRequesting = false;
  }

  private customResponseHandler = async <
    O = SSEOutput,
    M extends SimpleType = any,
  >(
    response: Response,
    callbacks?: XRequestCallbacks<O, M>,
    transformStream?: XStreamOptions<O>['transformStream'],
    streamTimeout?: number | undefined,
    streamSeparator?: string,
    partSeparator?: string,
    kvSeparator?: string,
    requestSignal?: AbortSignal,
    generation?: number,
  ) => {
    const stream = XStream<O>({
      readableStream: response.body!,
      transformStream,
      streamSeparator,
      partSeparator,
      kvSeparator,
    });
    await this.processStream<O, M>(
      stream,
      response,
      callbacks,
      streamTimeout,
      requestSignal,
      generation,
    );
  };

  private sseResponseHandler = async <
    O = SSEOutput,
    M extends SimpleType = any,
  >(
    response: Response,
    callbacks?: XRequestCallbacks<O, M>,
    streamTimeout?: number,
    streamSeparator?: string,
    partSeparator?: string,
    kvSeparator?: string,
    requestSignal?: AbortSignal,
    generation?: number,
  ) => {
    const stream = XStream<O>({
      readableStream: response.body!,
      streamSeparator,
      partSeparator,
      kvSeparator,
    });
    await this.processStream<O, M>(
      stream,
      response,
      callbacks,
      streamTimeout,
      requestSignal,
      generation,
    );
  };

  private async processStream<O, M extends SimpleType = any>(
    stream: XReadableStream<O>,
    response: Response,
    callbacks?: XRequestCallbacks<O, M>,
    streamTimeout?: number,
    requestSignal?: AbortSignal,
    generation?: number,
  ) {
    const controller = this.abortController;
    const isCurrent = () =>
      generation === undefined ||
      (generation === this.requestGeneration &&
        (!requestSignal || requestSignal === controller.signal));
    const chunks: O[] = [];
    const iterator = stream[Symbol.asyncIterator]();
    let streamTimeoutHandler: ReturnType<typeof setTimeout> | undefined;
    let result: IteratorResult<O, any>;
    do {
      if (!isCurrent()) {
        try {
          await iterator.return?.(undefined);
        } catch {
          /* ignore cleanup errors */
        }
        return;
      }
      if (streamTimeout) {
        streamTimeoutHandler = setTimeout(() => {
          if (!isCurrent()) return;
          this.isStreamTimeout = true;
          this.finishRequest();
          // Abort this request's own controller before notifying the app:
          // `onError` may synchronously start a new request.
          controller.abort();
          callbacks?.onError?.(
            new Error('StreamTimeoutError'),
            undefined,
            response.headers,
          );
        }, streamTimeout);
        this.streamTimeoutHandler = streamTimeoutHandler;
      }
      result = await iterator.next();
      clearTimeout(streamTimeoutHandler);
      if (!isCurrent()) {
        try {
          await iterator.return?.(undefined);
        } catch {
          /* ignore cleanup errors */
        }
        return;
      }
      if (this.isStreamTimeout) {
        break;
      }
      if (result.value) {
        chunks.push(result.value);
        callbacks?.onUpdate?.(result.value, response.headers);
        // `onUpdate` may synchronously start a newer request; stop touching
        // this request's state if it did.
        if (!isCurrent()) {
          try {
            await iterator.return?.(undefined);
          } catch {
            /* ignore cleanup errors */
          }
          return;
        }
        if (typeof (result.value as any)?.id !== 'undefined') {
          this.lastEventId = (result.value as any).id;
        }
      }
    } while (!result.done);
    if (streamTimeout) {
      clearTimeout(streamTimeoutHandler);
      if (this.isStreamTimeout) {
        // Release the stream reader so a timed-out response stops consuming.
        try {
          await iterator.return?.(undefined);
        } catch {
          /* ignore cleanup errors */
        }
        this.finishRequest();
        return;
      }
    }
    if (!isCurrent()) return;
    this.finishRequest();
    callbacks?.onSuccess?.(chunks, response.headers);
  }

  private jsonResponseHandler = async <
    O = JSONOutPut,
    M extends SimpleType = any,
  >(
    response: Response,
    requestSignal: AbortSignal,
    callbacks?: XRequestCallbacks<O, M>,
    generation?: number,
  ) => {
    const isCurrent = () =>
      generation === undefined ||
      (generation === this.requestGeneration &&
        requestSignal === this.abortController.signal);
    const chunk: O = await response.json();

    if (!isCurrent()) return;

    if ((chunk as unknown as JSONOutPut)?.success === false) {
      const j = chunk as unknown as JSONOutPut;
      const error = new Error(j.message || 'System error');
      error.name = j.name || 'SystemError';
      this.finishRequest();
      callbacks?.onError?.(error, chunk, response.headers);
    } else {
      callbacks?.onUpdate?.(chunk, response.headers);
      // `onUpdate` may synchronously start a newer request; do not clear or
      // complete that request's state.
      if (!isCurrent()) return;
      this.finishRequest();
      callbacks?.onSuccess?.([chunk], response.headers);
    }
  };

  private resetRetry() {
    clearTimeout(this.retryTimer);
    this.retryTimes = 0;
    this.lastEventId = undefined;
  }
}

function XRequest<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
>(
  baseURL: string,
  options?: XRequestOptions<Input, Output, ChatMessage>,
): AbstractXRequestClass<Input, Output, ChatMessage> {
  return new XRequestClass<Input, Output, ChatMessage>(baseURL, options);
}

export default XRequest;
export type { XFetchMiddlewares } from './x-fetch';
export { XRequest };
