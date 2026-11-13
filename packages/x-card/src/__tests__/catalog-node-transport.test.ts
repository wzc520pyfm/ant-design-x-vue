// @vitest-environment node
import http from 'node:http';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearCatalogCache, loadCatalog } from '../catalog';

let server: http.Server | undefined;

async function startServer(handler: http.RequestListener): Promise<string> {
  server = http.createServer(handler);
  await new Promise<void>((resolve) => {
    server!.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start the catalog test server.');
  }
  return `http://127.0.0.1:${address.port}/catalog.json`;
}

afterEach(async () => {
  clearCatalogCache();
  if (server) {
    server.closeAllConnections?.();
    await new Promise<void>((resolve) => {
      server!.close(() => resolve());
    });
    server = undefined;
  }
});

describe('Node catalog transport', () => {
  it('loads a catalog through the Node transport', async () => {
    const url = await startServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ components: { Text: { type: 'object' } } }));
    });

    await expect(
      loadCatalog(url, { allowInternalHosts: true }),
    ).resolves.toHaveProperty('components');
  });

  it('times out a stalled request', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const url = await startServer(() => {
      /* never respond */
    });

    await expect(
      loadCatalog(url, { allowInternalHosts: true, requestTimeoutMs: 50 }),
    ).rejects.toThrow(/timed out/);

    error.mockRestore();
  });

  it('rejects responses over the size cap', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const url = await startServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: 'x'.repeat(1000) }));
    });

    await expect(
      loadCatalog(url, {
        allowInternalHosts: true,
        maxResponseBytes: 100,
      }),
    ).rejects.toThrow(/maximum size/);

    error.mockRestore();
  });
});
