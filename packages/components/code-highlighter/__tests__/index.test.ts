import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import CodeHighlighter from '../index';
import { __resetLanguageCacheForTests } from '../loadLanguage';

describe('CodeHighlighter', () => {
  const mounted: { unmount: () => void }[] = [];

  afterEach(() => {
    while (mounted.length) {
      mounted.pop()?.unmount();
    }
    __resetLanguageCacheForTests();
  });

  function track<T extends { unmount: () => void }>(wrapper: T) {
    mounted.push(wrapper);
    return wrapper;
  }

  async function flush(ms = 0) {
    await Promise.resolve();
    await Promise.resolve();
    await nextTick();
    await new Promise((r) => setTimeout(r, ms));
    await nextTick();
  }

  it('renders highlighted code with default header', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log("javascript");',
        },
      }),
    );
    await flush();
    expect(wrapper.find('.ant-codeHighlighter').exists()).toBe(true);
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(true);
    expect(wrapper.find('.ant-codeHighlighter-header-title').text()).toContain(
      'javascript',
    );
    expect(wrapper.text()).toContain('console.log');
    expect(wrapper.find('pre').exists()).toBe(true);
    expect(wrapper.find('code').exists()).toBe(true);
  });

  it('hides header when header is false', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log(1);',
          header: false,
        },
      }),
    );
    await flush();
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(false);
  });

  it('hides header when header is null', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log(1);',
          header: null,
        },
      }),
    );
    await flush();
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(false);
  });

  it('supports custom header vnode', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'const a = 1;',
          header: h('div', { class: 'myCustomClass' }, 'custom header'),
        },
      }),
    );
    await flush();
    expect(wrapper.find('.myCustomClass').text()).toContain('custom header');
  });

  it('supports header factory returning false', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'const a = 1;',
          header: () => false,
        },
      }),
    );
    await flush();
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(false);
  });

  it('applies classNames and styles', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'const a = 1;',
          classNames: {
            header: 'customHeader',
            headerTitle: 'customHeaderTitle',
            code: 'customCodeClass',
          },
          styles: {
            root: { backgroundColor: 'red' },
            header: { padding: '10px' },
            headerTitle: { color: 'red' },
            code: { padding: '20px' },
          },
        },
      }),
    );
    await flush();
    expect(wrapper.find('.customHeader').exists()).toBe(true);
    expect(wrapper.find('.customHeaderTitle').exists()).toBe(true);
    expect(wrapper.find('.customCodeClass').exists()).toBe(true);
    const root = wrapper.find('.ant-codeHighlighter').element as HTMLElement;
    expect(root.style.backgroundColor).toBe('red');
    const header = wrapper.find('.ant-codeHighlighter-header')
      .element as HTMLElement;
    expect(header.style.padding).toBe('10px');
    const title = wrapper.find('.ant-codeHighlighter-header-title')
      .element as HTMLElement;
    expect(title.style.color).toBe('red');
    const code = wrapper.find('.ant-codeHighlighter-code')
      .element as HTMLElement;
    expect(code.style.padding).toBe('20px');
  });

  it('returns null when children empty', () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: { lang: 'javascript', children: '' },
      }),
    );
    expect(wrapper.find('.ant-codeHighlighter').exists()).toBe(false);
    expect(wrapper.find('code').exists()).toBe(false);
  });

  it('renders plain code when lang is empty', () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: { lang: '', children: 'plain text' },
      }),
    );
    expect(wrapper.find('code').exists()).toBe(true);
    expect(wrapper.text()).toContain('plain text');
    expect(wrapper.find('.ant-codeHighlighter').exists()).toBe(false);
  });

  it('applies custom className and prefixCls', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log(1);',
          className: 'myCustomClass',
          prefixCls: 'custom',
        },
      }),
    );
    await flush();
    expect(wrapper.find('.myCustomClass').exists()).toBe(true);
    expect(wrapper.find('.custom').exists()).toBe(true);
    expect(wrapper.find('.custom-code').exists()).toBe(true);
  });

  it('strips trailing newline from rendered code', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log("test");\n',
        },
      }),
    );
    await flush();
    expect(wrapper.text()).toContain('console.log');
    expect(wrapper.text()).not.toMatch(/\n$/);
  });

  it('exposes nativeElement via ref', async () => {
    const native = ref<HTMLElement>();
    const Host = defineComponent({
      setup() {
        return () =>
          h(CodeHighlighter, {
            lang: 'javascript',
            children: 'const x = 1;',
            ref: (inst: any) => {
              native.value = inst?.nativeElement;
            },
          });
      },
    });
    const wrapper = track(mount(Host));
    await flush();
    expect(native.value).toBeTruthy();
    expect(native.value?.classList.contains('ant-codeHighlighter')).toBe(true);
    wrapper.unmount();
  });

  it('supports prismLightMode false', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log("full");',
          prismLightMode: false,
        },
      }),
    );
    await flush(200);
    expect(wrapper.text()).toContain('console.log("full");');
  });

  it('warns when language fails to load', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'nonexistent-lang-xyz',
          children: 'const x = 42;',
        },
      }),
    );
    await flush(50);
    expect(wrapper.text()).toContain('const x = 42;');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('passes data attributes via rest props', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log(1);',
        },
        attrs: {
          'data-testid': 'code-highlighter-test',
        },
      }),
    );
    await flush();
    expect(
      wrapper.find('[data-testid="code-highlighter-test"]').exists(),
    ).toBe(true);
  });

  it('supports showLineNumbers via highlightProps', async () => {
    const wrapper = track(
      mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'line1;\nline2;',
          highlightProps: { showLineNumbers: true, startingLineNumber: 5 },
        },
      }),
    );
    await flush(50);
    expect(wrapper.find('.ant-codeHighlighter-line-number').exists()).toBe(
      true,
    );
    expect(wrapper.html()).toContain('>5<');
  });
});
