import { describe, expect, it } from 'vitest';
import {
  MockTboxProvider,
  MockTboxRequest,
  createTboxProviderFactory,
  defaultMockTboxReply,
} from '../../examples-v2/_shared/mock-tbox-provider';

describe('mock-tbox-provider', () => {
  it('default reply has think + text', () => {
    const reply = defaultMockTboxReply('什么是百宝箱');
    expect(reply.think.length).toBeGreaterThan(0);
    expect(reply.text).toContain('什么是百宝箱');
  });

  it('streams ext_text then text chunks', async () => {
    const updates: Array<{ text?: string; ext_text?: string }> = [];
    let successChunks: any[] = [];
    const request = new MockTboxRequest('mock', {
      callbacks: {
        onUpdate: (chunk) => {
          updates.push(chunk);
        },
        onSuccess: (chunks) => {
          successChunks = chunks;
        },
        onError: () => {},
      },
    });
    request.run({ message: { role: 'user', content: 'hello tbox' } });
    await new Promise((r) => setTimeout(r, 2500));
    expect(updates.some((u) => u.ext_text)).toBe(true);
    expect(updates.some((u) => u.text)).toBe(true);
    expect(successChunks.length).toBe(updates.length);
    const firstTextIdx = updates.findIndex((u) => u.text);
    const lastExtIdx = [...updates].map((u) => !!u.ext_text).lastIndexOf(true);
    expect(lastExtIdx).toBeLessThan(firstTextIdx);
  });

  it('provider accumulates content like React TboxProvider', () => {
    const provider = new MockTboxProvider({
      request: new MockTboxRequest('mock', {}),
    });
    const m1 = provider.transformMessage({
      chunk: { ext_text: 'think-a' },
      chunks: [],
      status: 'updating',
      responseHeaders: new Headers(),
    });
    expect(m1).toEqual({ content: { text: '', ext_text: 'think-a' }, role: 'assistant' });
    const m2 = provider.transformMessage({
      originMessage: m1,
      chunk: { text: 'ans' },
      chunks: [],
      status: 'updating',
      responseHeaders: new Headers(),
    });
    expect(m2).toEqual({ content: { text: 'ans', ext_text: 'think-a' }, role: 'assistant' });
  });

  it('factory caches per conversation key', () => {
    const factory = createTboxProviderFactory();
    expect(factory('a')).toBe(factory('a'));
    expect(factory('a')).not.toBe(factory('b'));
  });

  it('retry transformParams finds last user message', () => {
    const provider = new MockTboxProvider({
      request: new MockTboxRequest('mock', {}),
    });
    provider.injectGetMessages(() => [
      { role: 'user', content: 'q1' },
      { role: 'assistant', content: { text: 'a1', ext_text: 't1' } },
      { role: 'user', content: 'q2' },
      { role: 'assistant', content: { text: 'a2', ext_text: 't2' } },
    ]);
    const params = provider.transformParams(
      { userAction: 'retry' },
      { params: {} } as any,
    );
    expect(params.message).toEqual({ role: 'user', content: 'q2' });
    expect(params.userAction).toBe('retry');
  });
});
