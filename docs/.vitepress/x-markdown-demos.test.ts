import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const docRoot = join(__dirname, '..');

const DEMO_PATHS = [
  'x-markdown/basic',
  'x-markdown/streaming',
  'x-markdown/plugins',
  'x-markdown/components',
  'x-markdown/latex',
  'x-markdown/highlight',
  'x-markdown/mermaid',
  'x-markdown/themes',
  'x-markdown/streaming-syntax',
  'x-markdown/animation',
  'x-markdown/open-links',
  'x-markdown/think',
  'x-markdown/sources',
  'x-markdown/tokenizer',
  'x-markdown/walk-tokens',
  'x-markdown/renderer',
  'x-markdown/chinese-link',
  'x-markdown/xss',
  'x-markdown/latex-streaming',
  'x-markdown/highlight-streaming',
  'x-markdown/mermaid-streaming',
  'x-markdown/themes-custom',
  'x-markdown/thought-chain',
  'x-markdown/data-chart',
  'x-markdown/custom-footnote',
  'x-markdown/xprovider-locale',
  'x-markdown/xprovider-theme',
];

describe('x-markdown demo-v2 pairs', () => {
  it.each(DEMO_PATHS)('has examples-v2 + examples-v2-setup for %s', (rel) => {
    const v2 = join(docRoot, 'examples-v2', `${rel}.vue`);
    const setup = join(docRoot, 'examples-v2-setup', `${rel}.vue`);
    expect(existsSync(v2), `missing ${v2}`).toBe(true);
    expect(existsSync(setup), `missing ${setup}`).toBe(true);
  });

  it('data-chart demos load GPT-Vis only on the client', () => {
    for (const dir of ['examples-v2', 'examples-v2-setup'] as const) {
      const file = join(docRoot, dir, 'x-markdown/data-chart.vue');
      const source = readFileSync(file, 'utf8');
      expect(source, file).toContain("import('@antv/gpt-vis')");
      expect(source, file).not.toMatch(/from ['"].*gpt-vis-line['"]/);
      expect(source, file).not.toMatch(/from ['"]@antv\/gpt-vis['"]/);
    }
  });
});
