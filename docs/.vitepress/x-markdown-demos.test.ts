import { existsSync } from 'node:fs';
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
];

describe('x-markdown demo-v2 pairs', () => {
  it.each(DEMO_PATHS)('has examples-v2 + examples-v2-setup for %s', (rel) => {
    const v2 = join(docRoot, 'examples-v2', `${rel}.vue`);
    const setup = join(docRoot, 'examples-v2-setup', `${rel}.vue`);
    expect(existsSync(v2), `missing ${v2}`).toBe(true);
    expect(existsSync(setup), `missing ${setup}`).toBe(true);
  });
});
