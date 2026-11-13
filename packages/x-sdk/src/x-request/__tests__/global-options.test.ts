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
  it('merges headers case-insensitively while keeping unrelated defaults', async () => {
    const captured: any[] = [];

    setXRequestGlobalOptions({
      headers: { 'X-Global': '1', 'content-type': 'text/plain' },
    });
    mockedXFetch.mockImplementation(((_url: string, options: any) => {
      captured.push(options);
      return Promise.resolve(jsonResponse({ ok: true }));
    }) as any);

    const callbacks = { onSuccess: vi.fn(), onError: vi.fn() };

    const first = XRequest(baseURL, {
      callbacks,
      headers: { 'X-Local': '2' },
    });
    await first.asyncHandler;

    const firstHeaders = captured[0].headers;
    expect(
      Object.keys(firstHeaders).filter(
        (key) => key.toLowerCase() === 'content-type',
      ),
    ).toEqual(['content-type']);
    expect(firstHeaders['content-type']).toBe('text/plain');
    expect(firstHeaders['X-Global']).toBe('1');
    expect(firstHeaders['X-Local']).toBe('2');

    const second = XRequest(baseURL, {
      callbacks,
      headers: { 'CONTENT-TYPE': 'application/xml' },
    });
    await second.asyncHandler;

    const secondHeaders = captured[1].headers;
    expect(
      Object.keys(secondHeaders).filter(
        (key) => key.toLowerCase() === 'content-type',
      ),
    ).toEqual(['CONTENT-TYPE']);
    expect(secondHeaders['CONTENT-TYPE']).toBe('application/xml');
  });
});
