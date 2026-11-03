import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const docRoot = join(__dirname, '..');

const DEMO_PATHS = [
  'x-sdk/preset',
  'x-sdk/conversations',
  'x-sdk/x-request',
  'x-sdk/x-stream',
  'x-sdk/x-stream/default-protocol',
  'x-sdk/x-stream/custom-protocol',
  'x-sdk/x-request/basic',
  'x-sdk/x-request/custom-params',
  'x-sdk/x-request/custom-transformer',
  'x-sdk/x-request/model',
  'x-sdk/x-request/timeout',
  'x-sdk/x-conversations/basic',
  'x-sdk/x-conversations/operations',
  'x-sdk/x-conversations/multi-instances',
  'x-sdk/x-conversations/with-x-chat',
  'x-sdk/x-chat/custom-request',
  'x-sdk/x-chat/model',
  'x-sdk/x-chat/deepSeek',
  'x-sdk/x-chat/defaultMessages',
  'x-sdk/x-chat/developer',
];

describe('x-sdk demo-v2 pairs', () => {
  it.each(DEMO_PATHS)('has examples-v2 + examples-v2-setup for %s', (rel) => {
    const v2 = join(docRoot, 'examples-v2', `${rel}.vue`);
    const setup = join(docRoot, 'examples-v2-setup', `${rel}.vue`);
    expect(existsSync(v2), `missing ${v2}`).toBe(true);
    expect(existsSync(setup), `missing ${setup}`).toBe(true);
  });
});
