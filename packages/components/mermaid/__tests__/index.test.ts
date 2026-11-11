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
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = track(
      mount(Mermaid, {
        slots: { default: () => mermaidContent },
        attachTo: document.body,
      }),
    );
    await flush();
    expect(wrapper.find('.ant-mermaid').exists()).toBe(true);
    expect(render).toHaveBeenCalled();
    expect(
      warn.mock.calls.some((args) =>
        args.some((arg) => String(arg).includes('Slot "default" invoked outside')),
      ),
    ).toBe(false);
    warn.mockRestore();
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
    expect(wrapper.find('.ant-mermaid-code .ant-codeHighlighter').exists()).toBe(true);
    expect(wrapper.find('.ant-mermaid-code .ant-codeHighlighter-header').exists()).toBe(false);
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

  it('passes highlightProps to the code highlighter', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          highlightProps: {
            codeTagProps: { 'data-highlight': 'custom' },
          },
        },
        attachTo: document.body,
      }),
    );
    await flush();
    const inputs = wrapper.findAll('input.ant-segmented-item-input');
    await inputs[1].setValue(true);
    await inputs[1].trigger('change');
    await flush(100);

    expect(wrapper.find('code[data-highlight="custom"]').exists()).toBe(true);
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

  it('keeps the latest diagram when two renders overlap', async () => {
    const ids: string[] = [];
    let releaseFirst: () => void = () => {};
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    let call = 0;

    render.mockImplementation(async (id: string) => {
      ids.push(id);
      call += 1;
      if (call === 1) {
        await firstGate;
      }
      return {
        svg: `<svg id="${id}" viewBox="0 0 100 100"><rect width="100" height="100" /></svg>`,
      };
    });

    const wrapper = track(
      mount(Mermaid, {
        props: { children: 'graph TD; A-->B;' },
        attachTo: document.body,
      }),
    );
    await flush(120);
    expect(render).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ children: 'graph TD; B-->C;' });
    await flush(120);
    expect(render).toHaveBeenCalledTimes(1);

    releaseFirst();
    await flush(180);

    expect(render).toHaveBeenCalledTimes(2);
    const graphHtml = wrapper.find('.ant-mermaid-graph').html();
    expect(graphHtml).toContain(`id="${ids[1]}"`);
    expect(graphHtml).not.toContain(`id="${ids[0]}"`);
  });

  it('renders multiple instances with unique mermaid ids', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(Mermaid, { children: mermaidContent }),
            h(Mermaid, { children: mermaidContent }),
          ]);
      },
    });

    const wrapper = track(mount(Host, { attachTo: document.body }));
    await flush(200);

    const svgs = wrapper.findAll('.ant-mermaid-graph svg');
    expect(svgs).toHaveLength(2);
    const ids = svgs.map((svg) => svg.attributes('id'));
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
  });

  it('allows zooming past 3x', async () => {
    const wrapper = track(
      mount(Mermaid, {
        props: {
          children: mermaidContent,
          actions: { enableDownload: false },
        },
        attachTo: document.body,
      }),
    );
    await flush();

    const zoomIn = wrapper.findAll('.ant-actions-item')[0];
    for (let i = 0; i < 15; i += 1) {
      await zoomIn.trigger('click');
    }
    await nextTick();
    await flushPromises();

    const svg = wrapper.find('.ant-mermaid-graph svg');
    const scale = Number(
      svg.attributes('style')?.match(/scale\(([\d.]+)\)/)?.[1] ?? 0,
    );
    expect(scale).toBeGreaterThan(3);
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
