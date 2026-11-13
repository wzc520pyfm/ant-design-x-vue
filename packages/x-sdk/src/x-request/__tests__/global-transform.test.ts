import { describe, expect, it, vi } from 'vitest';
import XRequest, { setXRequestGlobalOptions } from '../index';
import xFetch from '../x-fetch';

vi.mock('../x-fetch', () => ({
  default: vi.fn(),
}));

const mockedXFetch = xFetch as unknown as ReturnType<typeof vi.fn>;

const baseURL = 'https://api.example.com/v1/chat';

function sseResponse() {
  return {
    ok: true,
    status: 200,
    headers: { get: () => 'text/event-stream' },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: hello\n\n'));
        controller.close();
      },
    }),
  };
}

describe('XRequest global transformStream', () => {
  it('ignores a shared TransformStream instance across requests', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setXRequestGlobalOptions({
      transformStream: new TransformStream() as any,
    });
    mockedXFetch.mockImplementation(() => Promise.resolve(sseResponse()));

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const run = async () => {
      const request = XRequest(baseURL, {
        manual: true,
        callbacks: { onSuccess, onError },
      });
      request.run({});
      await request.asyncHandler;
    };

    await Promise.all([run(), run()]);

    expect(onSuccess).toHaveBeenCalledTimes(2);
    expect(onError).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
