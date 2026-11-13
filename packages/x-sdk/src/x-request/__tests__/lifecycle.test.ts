import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import XRequest, {
  setXRequestGlobalOptions,
  type XRequestCallbacks,
} from '../index';
import xFetch from '../x-fetch';

vi.mock('../x-fetch', () => ({
  default: vi.fn(),
}));

const mockedXFetch = xFetch as unknown as ReturnType<typeof vi.fn>;

const baseURL = 'https://api.example.com/v1/chat';

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    headers: { get: () => 'application/json; charset=utf-8' },
    json: async () => data,
  };
}

function createCallbacks(): XRequestCallbacks<any> {
  return {
    onSuccess: vi.fn(),
    onError: vi.fn(),
    onUpdate: vi.fn(),
  };
}

describe('XRequest lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('recovers after a request timeout', async () => {
    vi.useFakeTimers();
    const callbacks = createCallbacks();
    mockedXFetch.mockImplementationOnce(
      ((_url: string, options: any) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        })) as any,
    );

    const request = XRequest(baseURL, { manual: true, timeout: 10, callbacks });
    request.run({});
    await vi.advanceTimersByTimeAsync(20);

    expect(callbacks.onError).toHaveBeenCalledTimes(1);
    expect((callbacks.onError as any).mock.calls[0][0].message).toBe(
      'TimeoutError',
    );

    mockedXFetch.mockResolvedValueOnce(jsonResponse({ answer: 42 }));
    request.run({});
    await request.asyncHandler;

    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
    expect((callbacks.onSuccess as any).mock.calls[0][0]).toEqual([
      { answer: 42 },
    ]);
  });

  it('aborts the transport when the response times out', async () => {
    vi.useFakeTimers();
    const callbacks = createCallbacks();
    let requestSignal: AbortSignal | undefined;

    mockedXFetch.mockImplementationOnce(((_url: string, options: any) => {
      requestSignal = options.signal;
      return new Promise(() => {});
    }) as any);

    const request = XRequest(baseURL, { manual: true, timeout: 5, callbacks });
    request.run({});
    await vi.advanceTimersByTimeAsync(10);

    expect(requestSignal?.aborted).toBe(true);
  });

  it('aborts a hung stream and recovers after a stream timeout', async () => {
    vi.useFakeTimers();
    const callbacks = createCallbacks();
    let requestSignal: AbortSignal | undefined;

    mockedXFetch.mockImplementationOnce(((_url: string, options: any) => {
      requestSignal = options.signal;
      const body = new ReadableStream({
        start(controller) {
          options.signal.addEventListener('abort', () => {
            controller.error(new DOMException('Aborted', 'AbortError'));
          });
        },
      });
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'text/event-stream' },
        body,
      });
    }) as any);

    const request = XRequest(baseURL, {
      manual: true,
      streamTimeout: 10,
      callbacks,
    });
    request.run({});
    await vi.advanceTimersByTimeAsync(20);

    expect(requestSignal?.aborted).toBe(true);
    expect(callbacks.onError).toHaveBeenCalledTimes(1);
    expect((callbacks.onError as any).mock.calls[0][0].message).toBe(
      'StreamTimeoutError',
    );

    mockedXFetch.mockResolvedValueOnce(jsonResponse({ done: true }));
    request.run({});
    await request.asyncHandler;

    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
  });

  it('ignores callbacks from a superseded request', async () => {
    const callbacks = createCallbacks();
    let resolveFirst!: (value: unknown) => void;

    mockedXFetch.mockImplementationOnce(
      (() =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        })) as any,
    );

    const request = XRequest(baseURL, { manual: true, callbacks });
    request.run({ request: 'first' });

    mockedXFetch.mockResolvedValueOnce(jsonResponse({ request: 'second' }));
    request.run({ request: 'second' });
    await request.asyncHandler;

    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
    expect((callbacks.onSuccess as any).mock.calls[0][0]).toEqual([
      { request: 'second' },
    ]);

    resolveFirst(jsonResponse({ request: 'first' }));
    await Promise.resolve();
    await Promise.resolve();

    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
    expect(callbacks.onUpdate).not.toHaveBeenCalledWith(
      { request: 'first' },
      expect.anything(),
    );
  });

  it('merges global headers instead of replacing them', async () => {
    const callbacks = createCallbacks();
    let capturedOptions: any;

    setXRequestGlobalOptions({ headers: { 'X-Global': '1' } });
    mockedXFetch.mockImplementationOnce(((_url: string, options: any) => {
      capturedOptions = options;
      return Promise.resolve(jsonResponse({ ok: true }));
    }) as any);

    const request = XRequest(baseURL, {
      callbacks,
      headers: { 'X-Local': '2' },
    });
    await request.asyncHandler;

    expect(capturedOptions.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Global': '1',
      'X-Local': '2',
    });
  });
});
