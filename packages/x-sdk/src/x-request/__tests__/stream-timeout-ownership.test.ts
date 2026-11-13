import { afterEach, describe, expect, it, vi } from 'vitest';
import XStream from '../../x-stream';
import XRequest from '../index';
import xFetch from '../x-fetch';

vi.mock('../x-fetch', () => ({
  default: vi.fn(),
}));

vi.mock('../../x-stream', () => ({
  default: vi.fn(),
}));

const mockedXFetch = xFetch as unknown as ReturnType<typeof vi.fn>;
const mockedXStream = XStream as unknown as ReturnType<typeof vi.fn>;

const baseURL = 'https://api.example.com/v1/chat';

describe('XRequest stream-timeout ownership', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not clear a request started during iterator cleanup', async () => {
    vi.useFakeTimers();
    let request!: ReturnType<typeof XRequest>;
    let fetchCalls = 0;

    const iterator = {
      next: () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ value: undefined, done: true }), 20);
        }),
      return: async () => {
        request.run({ second: true });
        return { value: undefined, done: true };
      },
    };
    mockedXStream.mockReturnValue({
      [Symbol.asyncIterator]: () => iterator,
    } as any);

    mockedXFetch.mockImplementation(((_url: string) => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: { get: () => 'text/event-stream' },
          body: new ReadableStream(),
        });
      }
      return new Promise(() => {});
    }) as any);

    const callbacks = { onSuccess: vi.fn(), onError: vi.fn() };
    request = XRequest(baseURL, {
      manual: true,
      streamTimeout: 10,
      callbacks,
    });
    request.run({});
    await vi.advanceTimersByTimeAsync(30);

    expect(fetchCalls).toBe(2);
    expect(callbacks.onError).toHaveBeenCalledTimes(1);
    expect((callbacks.onError as any).mock.calls[0][0].message).toBe(
      'StreamTimeoutError',
    );
    expect(request.isRequesting).toBe(true);
  });
});
