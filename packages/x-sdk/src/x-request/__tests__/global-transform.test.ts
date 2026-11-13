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

  it('calls the global transform factory per request and applies its output', async () => {
    const factory = vi.fn(
      (_baseURL: string, _headers: Headers) =>
        new TransformStream<string, { wrapped: string }>({
          transform(chunk, controller) {
            controller.enqueue({ wrapped: chunk.trim() });
          },
        }),
    );
    setXRequestGlobalOptions({ transformStream: factory as any });

    const headers = { get: () => 'text/event-stream' };
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('payload'));
          controller.close();
        },
      }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onUpdate = vi.fn();
    const request = XRequest(baseURL, {
      manual: true,
      callbacks: { onSuccess, onError, onUpdate },
    });
    request.run({});
    await request.asyncHandler;

    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith(baseURL, headers);
    expect(onUpdate).toHaveBeenCalledWith({ wrapped: 'payload' }, headers);
    expect(onSuccess).toHaveBeenCalledWith([{ wrapped: 'payload' }], headers);
    expect(onError).not.toHaveBeenCalled();
  });
});
