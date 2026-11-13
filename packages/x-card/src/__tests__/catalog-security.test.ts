import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearCatalogCache,
  createCatalogRegistry,
  loadCatalog,
  registerCatalog,
  type Catalog,
} from '../catalog';

afterEach(() => {
  clearCatalogCache();
});

const jsonResponse = (catalog: Catalog) =>
  new Response(JSON.stringify(catalog), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

describe('catalog registry isolation', () => {
  it('keeps local catalogs isolated per registry', async () => {
    const registryA = createCatalogRegistry();
    const registryB = createCatalogRegistry();

    registryA.register({
      $id: 'local://shared',
      components: { A: { type: 'object' } },
    });
    registryB.register({
      $id: 'local://shared',
      components: { B: { type: 'object' } },
    });

    const catalogA = await loadCatalog('local://shared', {
      registry: registryA,
    });
    const catalogB = await loadCatalog('local://shared', {
      registry: registryB,
    });

    expect(catalogA.components).toHaveProperty('A');
    expect(catalogA.components).not.toHaveProperty('B');
    expect(catalogB.components).toHaveProperty('B');
    expect(catalogB.components).not.toHaveProperty('A');

    registryA.clear();
    expect(registryA.get('local://shared')).toBeUndefined();
    expect(registryB.get('local://shared')).toBeDefined();
  });

  it('caches remote catalogs per registry instead of globally', async () => {
    const registryA = createCatalogRegistry();
    const registryB = createCatalogRegistry();
    const fetchMock = vi.fn(async () =>
      jsonResponse({ components: { Text: { type: 'object' } } }),
    );

    const url = 'https://catalog.example.com/catalog.json';
    await loadCatalog(url, { registry: registryA, fetch: fetchMock as any });
    await loadCatalog(url, { registry: registryB, fetch: fetchMock as any });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Same registry reuses its own cache.
    await loadCatalog(url, { registry: registryA, fetch: fetchMock as any });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    registryA.clear();
    await loadCatalog(url, { registry: registryB, fetch: fetchMock as any });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('shares explicitly registered catalogs with scoped registries', async () => {
    registerCatalog({
      $id: 'local://global',
      components: { Global: { type: 'object' } },
    });

    const catalog = await loadCatalog('local://global', {
      registry: createCatalogRegistry(),
    });

    expect(catalog.components).toHaveProperty('Global');
  });

  it('does not reuse a globally cached remote catalog in a scoped registry', async () => {
    const url = 'https://catalog.example.com/shared.json';
    const globalFetch = vi.fn(async () =>
      jsonResponse({ components: { Global: { type: 'object' } } }),
    );
    await loadCatalog(url, { fetch: globalFetch as any });

    const registry = createCatalogRegistry();
    const scopedFetch = vi.fn(async () =>
      jsonResponse({ components: { Scoped: { type: 'object' } } }),
    );
    const catalog = await loadCatalog(url, {
      registry,
      fetch: scopedFetch as any,
    });

    expect(scopedFetch).toHaveBeenCalledTimes(1);
    expect(catalog.components).toHaveProperty('Scoped');
    expect(catalog.components).not.toHaveProperty('Global');
  });
});

describe('catalog URL policy', () => {
  it('rejects loopback, private and metadata hosts before fetching', async () => {
    const fetchMock = vi.fn();
    const urls = [
      'http://127.0.0.1/catalog.json',
      'http://localhost/catalog.json',
      'http://169.254.169.254/latest/meta-data',
      'http://168.63.129.16/catalog.json',
      'http://10.0.0.1/catalog.json',
      'http://172.16.0.1/catalog.json',
      'http://192.168.1.1/catalog.json',
      'http://[::1]/catalog.json',
      'http://[64:ff9b::7f00:1]/catalog.json',
      'http://[64:ff9b::127.0.0.1]/catalog.json',
      'http://[64:ff9b:1::1]/catalog.json',
      'http://metadata.google.internal/computeMetadata/v1/',
    ];

    for (const url of urls) {
      await expect(
        loadCatalog(url, { fetch: fetchMock as any }),
      ).rejects.toThrow(/Blocked catalog URL/);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('allows internal hosts only with an explicit opt-in', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ components: { Text: { type: 'object' } } }),
    );
    const url = 'http://127.0.0.1/catalog.json';

    await expect(loadCatalog(url, { fetch: fetchMock as any })).rejects.toThrow(
      /Blocked catalog URL/,
    );
    expect(fetchMock).not.toHaveBeenCalled();

    await expect(
      loadCatalog(url, {
        fetch: fetchMock as any,
        allowInternalHosts: true,
      }),
    ).resolves.toHaveProperty('components');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('allows specifically listed hosts', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ components: { Text: { type: 'object' } } }),
    );

    await expect(
      loadCatalog('http://127.0.0.1/catalog.json', {
        fetch: fetchMock as any,
        allowedHosts: ['127.0.0.1'],
      }),
    ).resolves.toHaveProperty('components');

    await expect(
      loadCatalog('https://catalog.example.com/catalog.json', {
        fetch: fetchMock as any,
        allowedHosts: ['*.example.com'],
      }),
    ).resolves.toHaveProperty('components');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
