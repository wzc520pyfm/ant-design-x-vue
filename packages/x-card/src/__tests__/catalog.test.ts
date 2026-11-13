import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearCatalogCache,
  loadCatalog,
  registerCatalog,
  validateComponent,
  type Catalog,
} from '../catalog';

const demoCatalog: Catalog = {
  $id: 'local://demo',
  catalogId: 'local://demo',
  components: {
    Text: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
  },
};

afterEach(() => {
  clearCatalogCache();
});

describe('catalog', () => {
  it('registerCatalog + loadCatalog hits the in-memory cache', async () => {
    registerCatalog(demoCatalog);
    await expect(loadCatalog('local://demo')).resolves.toEqual(demoCatalog);
  });

  it('validateComponent checks required fields', () => {
    expect(validateComponent(demoCatalog, 'Text', { text: 'hi' })).toBe(true);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(validateComponent(demoCatalog, 'Text', {})).toBe(false);
    expect(validateComponent(demoCatalog, 'Missing', {})).toBe(false);
    warn.mockRestore();
  });

  it('clearCatalogCache drops registered catalogs', async () => {
    registerCatalog(demoCatalog);
    clearCatalogCache();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const empty = await loadCatalog('local://demo');
    expect(empty.components).toEqual({});
    warn.mockRestore();
  });

  it('rejects non-http(s) catalog URLs before fetching', async () => {
    await expect(loadCatalog('javascript:alert(1)')).rejects.toThrow(
      'Unsupported catalog URL',
    );
    await expect(loadCatalog('file:///etc/passwd')).rejects.toThrow(
      'Unsupported catalog URL',
    );
    await expect(
      loadCatalog('data:text/html,<script>alert(1)</script>'),
    ).rejects.toThrow('Unsupported catalog URL');
  });
});
