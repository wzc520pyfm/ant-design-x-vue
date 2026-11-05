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

describe('Mermaid render id', () => {
  beforeEach(() => {
    parse.mockClear();
    render.mockClear();
    initialize.mockClear();
    parse.mockResolvedValue(true);
    render.mockImplementation(async (id: string) => ({
      svg: `<svg id="${id}"><text>${id}</text></svg>`,
    }));
  });

  it('uses a new mermaid id when children length changes (React 2.0.0 parity)', async () => {
    const short = 'graph TD\n  A-->B';
    const longer = 'graph TD\n  A-->B\n  B-->C';

    const wrapper = mount(Mermaid, {
      props: { children: short },
      attachTo: document.body,
    });

    await flushPromises();
    await nextTick();
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();

    expect(render).toHaveBeenCalled();
    const firstId = render.mock.calls[0]?.[0] as string;
    expect(firstId).toMatch(new RegExp(`^mermaid-\\d+-${short.length}-\\d+$`));

    await wrapper.setProps({ children: longer });
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();

    const ids = render.mock.calls.map((c) => c[0] as string);
    expect(ids.length).toBeGreaterThanOrEqual(2);
    const lastId = ids[ids.length - 1];
    expect(lastId).toMatch(new RegExp(`^mermaid-\\d+-${longer.length}-\\d+$`));
    expect(lastId).not.toBe(firstId);

    wrapper.unmount();
  });

  it('does not call mermaid.render when parse rejects incomplete syntax', async () => {
    parse.mockResolvedValue(false);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(Mermaid, {
      props: { children: 'graph TD\n  A[' },
      attachTo: document.body,
    });
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();

    expect(render).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Mermaid render failed'));
    warn.mockRestore();
    wrapper.unmount();
  });
});
