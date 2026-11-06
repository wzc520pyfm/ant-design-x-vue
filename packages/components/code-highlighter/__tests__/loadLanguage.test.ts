import { beforeEach, describe, expect, it, vi } from 'vitest';
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
});
