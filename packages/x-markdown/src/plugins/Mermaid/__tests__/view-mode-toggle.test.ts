import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';

const { parse, render, initialize } = vi.hoisted(() => ({
  parse: vi.fn(async () => true),
  render: vi.fn(async (id: string) => ({
    svg: `<svg id="${id}"><text>${id}</text></svg>`,
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

import Mermaid from '../Mermaid.vue';

describe('Mermaid view mode toggle', () => {
  beforeEach(() => {
    parse.mockClear();
    render.mockClear();
    initialize.mockClear();
    parse.mockResolvedValue(true);
    render.mockImplementation(async (id: string) => ({
      svg: `<svg id="${id}"><text>${id}</text></svg>`,
    }));
  });

  it('can switch Image → Code → Image without crashing (React 2.0.0 parity)', async () => {
    const source = 'graph TD\n  A-->B';
    const wrapper = mount(Mermaid, {
      props: { children: source },
      attachTo: document.body,
    });
    await flushPromises();
    await nextTick();
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();

    const inputs = () => wrapper.findAll('input.ant-segmented-item-input');
    expect(inputs()).toHaveLength(2);
    expect((inputs()[0].element as HTMLInputElement).checked).toBe(true);

    // Image → Code
    await inputs()[1].setValue(true);
    await inputs()[1].trigger('change');
    await nextTick();
    await flushPromises();

    expect((inputs()[1].element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.find('[class$="-mermaid-code"]').exists()).toBe(true);

    // Code → Image (previously crashed Vue patch on h()-created action icons)
    await inputs()[0].setValue(true);
    await inputs()[0].trigger('change');
    await nextTick();
    await flushPromises();
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();

    expect((inputs()[0].element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.find('[class$="-mermaid-code"]').exists()).toBe(false);
    expect(wrapper.find('[class$="-mermaid-graph-hidden"]').exists()).toBe(false);

    wrapper.unmount();
  });
});
