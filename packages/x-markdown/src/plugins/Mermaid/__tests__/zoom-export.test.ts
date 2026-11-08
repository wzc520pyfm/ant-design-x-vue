import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

const { parse, render, initialize } = vi.hoisted(() => ({
  parse: vi.fn(async () => true),
  render: vi.fn(async (id: string) => ({
    svg: `<svg id="${id}" viewBox="0 0 640 480"><rect width="640" height="480" /></svg>`,
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

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

async function flush(ms = 150) {
  await flushPromises();
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, ms));
  await flushPromises();
  await nextTick();
}

async function mountDiagram() {
  const wrapper = mount(Mermaid, {
    props: {
      children: 'graph TD\n  Start --> Answer',
    },
    attachTo: document.body,
  });
  mountedWrappers.push(wrapper);
  await flush();
  return wrapper;
}

describe('Mermaid zoom and export', () => {
  beforeEach(() => {
    parse.mockClear();
    render.mockClear();
    initialize.mockClear();
    parse.mockResolvedValue(true);
    render.mockImplementation(async (id: string) => ({
      svg: `<svg id="${id}" viewBox="0 0 640 480"><rect width="640" height="480" /></svg>`,
    }));
  });

  afterEach(() => {
    while (mountedWrappers.length) {
      mountedWrappers.pop()?.unmount();
    }
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('allows zooming past 3x', async () => {
    const wrapper = await mountDiagram();

    // Action order in image mode: copy, zoom in, zoom out, reset, download.
    const zoomIn = wrapper.findAll('.ant-actions-item')[1];
    expect(zoomIn).toBeTruthy();
    for (let index = 0; index < 15; index += 1) {
      await zoomIn.trigger('click');
    }
    await nextTick();

    const svg = wrapper.find('[class$="-mermaid-graph"] svg');
    const scale = Number(
      svg.attributes('style')?.match(/scale\(([\d.]+)\)/)?.[1] ?? 0,
    );
    expect(scale).toBeGreaterThan(3);
  });

  it('exports at the diagram viewBox size instead of the scaled DOM size', async () => {
    const wrapper = await mountDiagram();
    const svg = wrapper.find('[class$="-mermaid-graph"] svg')
      .element as SVGSVGElement;
    Object.defineProperty(svg, 'viewBox', {
      configurable: true,
      value: { baseVal: { width: 640, height: 480 } },
    });
    svg.style.transform = 'scale(3) translate(20px, 10px)';
    const getBoundingClientRect = vi
      .spyOn(svg, 'getBoundingClientRect')
      .mockReturnValue({ width: 1920, height: 1440 } as DOMRect);

    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      scale: vi.fn(),
      drawImage,
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,test',
    );
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    let serializedSvg: SVGSVGElement | undefined;
    class MockXMLSerializer {
      serializeToString(node: Node) {
        serializedSvg = node as SVGSVGElement;
        return '<svg>test</svg>';
      }
    }
    vi.stubGlobal('XMLSerializer', MockXMLSerializer);
    vi.stubGlobal('devicePixelRatio', 2);

    class MockImage {
      onload: (() => void) | null = null;

      set src(_value: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal('Image', MockImage);

    const download = wrapper.findAll('.ant-actions-item')[4];
    expect(download).toBeTruthy();
    await download.trigger('click');
    await flush(20);

    expect(serializedSvg).toBeDefined();
    expect(serializedSvg).not.toBe(svg);
    expect(serializedSvg?.style.transform).toBe('');
    expect(serializedSvg?.getAttribute('width')).toBe('640');
    expect(serializedSvg?.getAttribute('height')).toBe('480');
    expect(getBoundingClientRect).not.toHaveBeenCalled();
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 640, 480);
    expect(anchorClick).toHaveBeenCalled();
  });
});
