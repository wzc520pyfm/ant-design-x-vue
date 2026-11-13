import { describe, expect, it, vi } from 'vitest';
import XRequest, { setXRequestGlobalOptions } from '../index';
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

describe('XRequest global options', () => {
  // This test mutates module-level state, so it lives in its own file to keep
  // Vitest's per-file module isolation.
  it('merges global headers instead of replacing them', async () => {
    let capturedOptions: any;

    setXRequestGlobalOptions({ headers: { 'X-Global': '1' } });
    mockedXFetch.mockImplementationOnce(((_url: string, options: any) => {
      capturedOptions = options;
      return Promise.resolve(jsonResponse({ ok: true }));
    }) as any);

    const callbacks = { onSuccess: vi.fn(), onError: vi.fn() };
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
