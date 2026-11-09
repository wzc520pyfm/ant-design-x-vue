import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

const { highlightCodeSpy } = vi.hoisted(() => ({
  highlightCodeSpy: vi.fn(),
}));

vi.mock('../loadLanguage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../loadLanguage')>();
  return {
    ...actual,
    highlightCode: (code: string, lang: string) => {
      highlightCodeSpy(code, lang);
      return actual.highlightCode(code, lang);
    },
  };
});

import CodeHighlighter from '../index';

describe('CodeHighlighter streaming cache', () => {
  const mounted: { unmount: () => void }[] = [];

  afterEach(() => {
    while (mounted.length) {
      mounted.pop()?.unmount();
    }
    highlightCodeSpy.mockClear();
  });

  async function flush() {
    await Promise.resolve();
    await Promise.resolve();
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
  }

  it('does not re-highlight when only the fresh domNode prop changes', async () => {
    const domNode = ref('first-parse');
    const code = ref('const stable = true;');

    const Host = defineComponent({
      setup() {
        return () =>
          h(CodeHighlighter, {
            lang: 'javascript',
            children: code.value,
            domNode: domNode.value,
          });
      },
    });

    mounted.push(mount(Host));
    await flush();
    expect(highlightCodeSpy).toHaveBeenCalledTimes(1);
    expect(highlightCodeSpy).toHaveBeenLastCalledWith(
      'const stable = true;',
      'javascript',
    );

    domNode.value = 'second-parse';
    await flush();
    expect(highlightCodeSpy).toHaveBeenCalledTimes(1);

    code.value = 'const stable = false;';
    await flush();
    expect(highlightCodeSpy).toHaveBeenCalledTimes(2);
    expect(highlightCodeSpy).toHaveBeenLastCalledWith(
      'const stable = false;',
      'javascript',
    );
  });
});
