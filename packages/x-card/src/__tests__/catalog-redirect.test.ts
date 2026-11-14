// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearCatalogCache, loadCatalog } from '../catalog';

afterEach(() => {
  clearCatalogCache();
});

describe('catalog redirect policy', () => {
  it('blocks redirects to internal hosts on the server', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = new Response(new ReadableStream(), {
      status: 302,
      headers: { location: 'http://169.254.169.254/latest/meta-data' },
    });
    const cancel = vi.spyOn(response.body!, 'cancel');
    const fetchMock = vi.fn(async () => response);

    await expect(
      loadCatalog('http://93.184.216.34/catalog.json', {
        fetch: fetchMock as any,
      }),
    ).rejects.toThrow(/Blocked catalog URL/);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });

  it('follows a redirect to another public host and releases its body', async () => {
    const redirect = new Response(new ReadableStream(), {
      status: 302,
      headers: { location: 'http://93.184.216.35/catalog.json' },
    });
    const cancel = vi.spyOn(redirect.body!, 'cancel');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(redirect)
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
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('releases the redirect body when Location is missing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = new Response(new ReadableStream(), { status: 302 });
    const cancel = vi.spyOn(response.body!, 'cancel');
    const fetchMock = vi.fn(async () => response);

    await expect(
      loadCatalog('http://93.184.216.34/catalog.json', {
        fetch: fetchMock as any,
      }),
    ).rejects.toThrow(/missing a Location header/);

    expect(cancel).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });

  it('releases a non-OK response body', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = new Response(new ReadableStream(), {
      status: 503,
      statusText: 'Service Unavailable',
    });
    const cancel = vi.spyOn(response.body!, 'cancel');
    const fetchMock = vi.fn(async () => response);

    await expect(
      loadCatalog('http://93.184.216.34/catalog.json', {
        fetch: fetchMock as any,
      }),
    ).rejects.toThrow(/Failed to load catalog/);

    expect(cancel).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });
});
