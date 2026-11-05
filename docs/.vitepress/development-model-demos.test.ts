import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const docRoot = join(__dirname, '..');

const DEMO_PATHS = [
  'development/openai-sdk',
  'development/openai-node',
  'development/qwen-sdk',
  'development/qwen-openai-node',
];

describe('development model demo-v2 pairs', () => {
  it.each(DEMO_PATHS)('has examples-v2 + examples-v2-setup for %s', (rel) => {
    const v2 = join(docRoot, 'examples-v2', `${rel}.vue`);
    const setup = join(docRoot, 'examples-v2-setup', `${rel}.vue`);
    expect(existsSync(v2), `missing ${v2}`).toBe(true);
    expect(existsSync(setup), `missing ${setup}`).toBe(true);
  });
});
