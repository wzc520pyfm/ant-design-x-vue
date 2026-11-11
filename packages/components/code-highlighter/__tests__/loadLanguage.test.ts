import { beforeEach, describe, expect, it, vi } from 'vitest';
import Prism from 'prismjs';
import { __resetLanguageCacheForTests, ensurePrismLanguage } from '../loadLanguage';

describe('ensurePrismLanguage', () => {
  beforeEach(() => {
    __resetLanguageCacheForTests();
  });

  it('warns on unknown language in light mode', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await ensurePrismLanguage('nonexistent-lang-xyz', true);
    expect(result).toBe('nonexistent-lang-xyz');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  }, 15000);

  it('maps vue to the bundled markup grammar', async () => {
    const result = await ensurePrismLanguage('vue', true);
    expect(result).toBe('markup');
    expect(Prism.languages.markup).toBeDefined();
  });

  it('loads statically mapped grammars in light mode', async () => {
    await ensurePrismLanguage('typescript', true);
    await ensurePrismLanguage('json', true);
    expect(Prism.languages.typescript).toBeDefined();
    expect(Prism.languages.json).toBeDefined();
  });
});
