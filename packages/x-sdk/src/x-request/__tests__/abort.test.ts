import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { XRequestCallbacks, XRequestOptions } from '../index';
import XRequest from '../index';

const baseURL = 'https://api.example.com/v1/chat';
const callbacks: XRequestCallbacks<any> = {
  onSuccess: vi.fn(),
  onError: vi.fn(),
  onUpdate: vi.fn(),
};
const options: XRequestOptions = {
  params: {
    model: 'gpt-3.5-turbo',
    dangerouslyApiKey: 'dangerouslyApiKey',
    messages: [{ role: 'user', content: 'Hello' }],
  },
  callbacks,
};

describe('XRequest Class abort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (signal?.aborted) {
            reject(new DOMException('The operation was aborted. ', 'AbortError'));
            return;
          }
          const onAbort = () => {
            reject(new DOMException('The operation was aborted. ', 'AbortError'));
          };
          signal?.addEventListener('abort', onAbort, { once: true });
        });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should throw error when abort', async () => {
    const request = XRequest(baseURL, {
      ...options,
    });
    request.abort();
    await request.asyncHandler;
    expect(callbacks.onError).toHaveBeenCalledWith(
      new DOMException('The operation was aborted. ', 'AbortError'),
    );
  });
});
