import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

const { parse, render, initialize } = vi.hoisted(() => ({
  parse: vi.fn(async () => true),
  render: vi.fn(async (id: string) => ({
    svg: `<svg id="${id}" viewBox="0 0 100 100"><rect width="100" height="100" /></svg>`,
  })),
  initialize: vi.fn(),
}));

vi.mock('mermaid', () => ({
  default: {
    initialize,
    parse,
    render,
  },
}));

import Mermaid from '../index';

const mermaidContent = 'graph TD; A-->B;';

describe('Mermaid', () => {
  const mounted: { unmount: () => void }[] = [];

  function track<T extends { unmount: () => void }>(wrapper: T) {
    mounted.push(wrapper);
    return wrapper;
  }

  async function flush(ms = 150) {
    await flushPromises();
    await nextTick();
    await new Promise((r) => setTimeout(r, ms));
    await flushPromises();
    await nextTick();
  }

  beforeEach(() => {
    parse.mockClear();
    render.mockClear();
    initialize.mockClear();
    parse.mockResolvedValue(true);
    render.mockImplementation(async (id: string) => ({
      svg: `<svg id="${id}" viewBox="0 0 100 100"><rect width="100" height="100" /></svg>`,
    }));
  });

  afterEach(() => {
    while (mounted.length) {
      mounted.pop()?.unmount();
    }
  });

  it('renders correctly with valid mermaid code', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: { children: mermaidContent },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.ant-mermaid').exists()).toBe(true);
    expect(initialize).toHaveBeenCalled();
    expect(render).toHaveBeenCalled();
    expect(wrapper.find('.ant-mermaid-graph').html()).toContain('svg');
  });

  it('returns null when children empty', () => {
    const wrapper = track(
      mount(Mermaid, {
        props: { children: '' },
      }),
    );
    expect(wrapper.find('.ant-mermaid').exists()).toBe(false);
  });

  it('supports default slot as children', async () => {
    const wrapper = track(
      mount(Mermaid, {
        slots: { default: () => mermaidContent },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.ant-mermaid').exists()).toBe(true);
    expect(render).toHaveBeenCalled();
  });

  it('initializes mermaid with config', async () => {
    const config = { theme: 'dark' as const, fontFamily: 'monospace' };
    track(
      mount(Mermaid, {
        props: { children: mermaidContent, config },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'dark',
        fontFamily: 'monospace',
      }),
    );
  });

  it('switches between image and code view', async () => {
    const onRenderTypeChange = vi.fn();
    const wrapper = track(
      mount(Mermaid, {
        props: { children: mermaidContent, onRenderTypeChange },
        attachTo: document.body,
      }),
    );
    await flush();

    const inputs = () => wrapper.findAll('input.ant-segmented-item-input');
    expect(inputs()).toHaveLength(2);

    await inputs()[1].setValue(true);
    await inputs()[1].trigger('change');
    await nextTick();
    await flushPromises();

    expect(wrapper.find('.ant-mermaid-code').exists()).toBe(true);
    expect(wrapper.find('.ant-mermaid-graph-hidden').exists()).toBe(true);
    expect(wrapper.find('.ant-mermaid-code').text()).toContain('graph TD');
    expect(onRenderTypeChange).toHaveBeenCalledWith('code');

    await inputs()[0].setValue(true);
    await inputs()[0].trigger('change');
    await nextTick();
    await flush(150);

    expect(wrapper.find('.ant-mermaid-code').exists()).toBe(false);
    expect(onRenderTypeChange).toHaveBeenCalledWith('image');
  });

  it('hides header when header is null', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: { children: mermaidContent, header: null },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.ant-mermaid-header').exists()).toBe(false);
  });

  it('hides header when header is false', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: { children: mermaidContent, header: false },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.ant-mermaid-header').exists()).toBe(false);
  });

  it('supports custom header vnode', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          header: h('div', { class: 'myCustomHeader' }, 'custom header'),
        },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.myCustomHeader').text()).toContain('custom header');
    expect(wrapper.find('.ant-mermaid-header').exists()).toBe(false);
  });

  it('applies classNames and styles', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          classNames: {
            header: 'customHeader',
            graph: 'customGraph',
            code: 'customCode',
          },
          styles: {
            root: { backgroundColor: 'red' },
            header: { padding: '10px' },
            graph: { height: '200px' },
          },
        },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.customHeader').exists()).toBe(true);
    expect(wrapper.find('.customGraph').exists()).toBe(true);
    const root = wrapper.find('.ant-mermaid').element as HTMLElement;
    expect(root.style.backgroundColor).toBe('red');
  });

  it('applies custom className and prefixCls', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          className: 'myCustomClass',
          prefixCls: 'custom',
        },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.myCustomClass').exists()).toBe(true);
    expect(wrapper.find('.custom').exists()).toBe(true);
    expect(wrapper.find('.custom-graph').exists()).toBe(true);
  });

  it('respects actions.enableZoom=false (no zoom items)', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          actions: { enableZoom: false, enableDownload: true },
        },
        attachTo: document.body,
      }),
    );
    await flush();
    // Labels live in Tooltip titles; count action items instead.
    const items = wrapper.findAll('.ant-actions-item');
    expect(items).toHaveLength(1);
  });

  it('adds customActions to header', async () => {
    const onItemClick = vi.fn();
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          actions: {
            enableZoom: false,
            enableDownload: false,
            customActions: [
              { key: 'share', label: 'Share', onItemClick },
            ],
          },
        },
        attachTo: document.body,
      }),
    );
    await flush();
    const items = wrapper.findAll('.ant-actions-item');
    expect(items).toHaveLength(1);
    await items[0].trigger('click');
    await nextTick();
    expect(onItemClick).toHaveBeenCalled();
  });

  it('handles invalid mermaid syntax without crashing', async () => {
    parse.mockResolvedValue(false);
    const wrapper = track(
      mount(Mermaid, {
        props: { children: 'not valid' },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.ant-mermaid').exists()).toBe(true);
  });

  it('exposes nativeElement via ref', async () => {
    const native = ref<HTMLElement>();
    const Host = defineComponent({
      setup() {
        return () =>
          h(Mermaid, {
            children: mermaidContent,
            ref: (inst: any) => {
              native.value = inst?.nativeElement;
            },
          });
      },
    });
    track(mount(Host, { attachTo: document.body }));
    await flush();
    expect(native.value).toBeTruthy();
    expect(native.value?.classList.contains('ant-mermaid')).toBe(true);
  });
});
