import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import XRequest, { type XRequestCallbacks } from '../index';
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

  it('does not abort a request started from the timeout callback', async () => {
    vi.useFakeTimers();
    let request!: ReturnType<typeof XRequest>;
    let restarted = false;
    let fetchCalls = 0;
    const callbacks: XRequestCallbacks<any> = {
      onSuccess: vi.fn(),
      onUpdate: vi.fn(),
      onError: vi.fn(() => {
        if (restarted) return;
        restarted = true;
        request.run({ second: true });
      }),
    };

    mockedXFetch.mockImplementation(((_url: string, options: any) => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        });
      }
      return new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError')),
        );
        setTimeout(() => resolve(jsonResponse({ second: true })), 5);
      });
    }) as any);

    request = XRequest(baseURL, { manual: true, timeout: 10, callbacks });
    request.run({});
    await vi.advanceTimersByTimeAsync(20);
    await request.asyncHandler;

    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
    expect((callbacks.onSuccess as any).mock.calls[0][0]).toEqual([
      { second: true },
    ]);
    expect(callbacks.onError).not.toHaveBeenCalledWith(
      expect.objectContaining({ name: 'AbortError' }),
    );
  });

  it('keeps the active timeout when a superseded request settles', async () => {
    vi.useFakeTimers();
    const callbacks = createCallbacks();
    let fetchCalls = 0;

    mockedXFetch.mockImplementation(((_url: string, options: any) => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        });
      }
      return new Promise(() => {});
    }) as any);

    const request = XRequest(baseURL, { manual: true, timeout: 50, callbacks });
    request.run({ first: true });
    request.run({ second: true });
    // Let the superseded request's abort/catch settle before the active timeout.
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(60);

    const timeoutErrors = (callbacks.onError as any).mock.calls.filter(
      ([error]: [Error]) => error.message === 'TimeoutError',
    );
    expect(timeoutErrors).toHaveLength(1);
  });

  it('does not complete a request superseded from its onUpdate callback', async () => {
    vi.useFakeTimers();
    let request!: ReturnType<typeof XRequest>;
    let restarted = false;
    let fetchCalls = 0;
    const callbacks: XRequestCallbacks<any> = {
      onSuccess: vi.fn(),
      onUpdate: vi.fn(() => {
        if (restarted) return;
        restarted = true;
        request.run({ second: true });
      }),
      onError: vi.fn(),
    };

    mockedXFetch.mockImplementation(((_url: string) => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        return Promise.resolve(jsonResponse({ first: true }));
      }
      return new Promise(() => {});
    }) as any);

    request = XRequest(baseURL, { manual: true, callbacks });
    request.run({});
    await vi.advanceTimersByTimeAsync(0);

    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(request.isRequesting).toBe(true);
  });

  it('does not schedule a retry after onError starts a new request', async () => {
    vi.useFakeTimers();
    let request!: ReturnType<typeof XRequest>;
    let restarted = false;
    let fetchCalls = 0;
    const callbacks: XRequestCallbacks<any> = {
      onSuccess: vi.fn(),
      onUpdate: vi.fn(),
      onError: vi.fn(() => {
        if (restarted) return;
        restarted = true;
        request.run({ second: true });
      }),
    };

    mockedXFetch.mockImplementation(((_url: string, options: any) => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        return Promise.reject(new Error('boom'));
      }
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError')),
        );
      });
    }) as any);

    request = XRequest(baseURL, {
      manual: true,
      retryInterval: 10,
      retryTimes: 5,
      callbacks,
    });
    request.run({});
    await vi.advanceTimersByTimeAsync(30);

    expect(fetchCalls).toBe(2);
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(request.isRequesting).toBe(true);
  });

  it('does not overwrite a request started from the previous abort listener', async () => {
    vi.useFakeTimers();
    let request!: ReturnType<typeof XRequest>;
    let startedThird = false;
    let fetchCalls = 0;
    const callbacks: XRequestCallbacks<any> = {
      onSuccess: vi.fn(),
      onError: vi.fn(),
    };

    mockedXFetch.mockImplementation(((_url: string, options: any) => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        options.signal.addEventListener('abort', () => {
          if (startedThird) return;
          startedThird = true;
          request.run({ third: true });
        });
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        });
      }
      if (fetchCalls === 2) {
        return Promise.resolve(jsonResponse({ third: true }));
      }
      return new Promise(() => {});
    }) as any);

    request = XRequest(baseURL, { manual: true, callbacks });
    request.run({ first: true });
    request.run({ second: true });
    await vi.advanceTimersByTimeAsync(0);

    expect(fetchCalls).toBe(2);
    await request.asyncHandler;
    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
    expect((callbacks.onSuccess as any).mock.calls[0][0]).toEqual([
      { third: true },
    ]);
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
});
