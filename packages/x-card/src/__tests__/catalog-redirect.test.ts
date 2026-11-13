// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearCatalogCache, loadCatalog } from '../catalog';

afterEach(() => {
  clearCatalogCache();
});

describe('catalog redirect policy', () => {
  it('blocks redirects to internal hosts on the server', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn(
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: 'http://169.254.169.254/latest/meta-data' },
        }),
    );

    await expect(
      loadCatalog('http://93.184.216.34/catalog.json', {
        fetch: fetchMock as any,
      }),
    ).rejects.toThrow(/Blocked catalog URL/);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });

  it('follows a redirect to another public host', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { location: 'http://93.184.216.35/catalog.json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ components: { Text: { type: 'object' } } }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          },
        ),
      );

    await expect(
      loadCatalog('http://93.184.216.34/catalog.json', {
        fetch: fetchMock as any,
      }),
    ).resolves.toHaveProperty('components');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(
      'http://93.184.216.35/catalog.json',
    );
  });
});
