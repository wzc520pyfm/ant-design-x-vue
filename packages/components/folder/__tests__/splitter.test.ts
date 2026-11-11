import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Splitter from '../Splitter.vue';

const mockRect = (el: Element, width: number, left = 0) => {
  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: left,
      y: 0,
      top: 0,
      left,
      right: left + width,
      bottom: 400,
      width,
      height: 400,
      toJSON() {
        return {};
      },
    }),
  });
};

const mountSplitter = (props: Record<string, unknown> = {}) =>
  mount(Splitter, {
    props: {
      prefixCls: 'ant-folder',
      defaultSize: 278,
      ...props,
    },
    slots: {
      start: '<div class="start-slot">tree</div>',
      end: '<div class="end-slot">preview</div>',
    },
  });

describe('Folder Splitter', () => {
  it('renders two panes and applies defaultSize', () => {
    const wrapper = mountSplitter({ defaultSize: 300 });
    const start = wrapper.find('.ant-folder-splitter-start');
    expect(start.exists()).toBe(true);
    expect(wrapper.find('.ant-folder-splitter-end').exists()).toBe(true);
    expect((start.element as HTMLElement).style.width).toBe('300px');
    expect(wrapper.text()).toContain('tree');
    expect(wrapper.text()).toContain('preview');
  });

  it('accepts percentage defaultSize as CSS width', () => {
    const wrapper = mountSplitter({ defaultSize: '40%' });
    expect(
      (wrapper.find('.ant-folder-splitter-start').element as HTMLElement).style
        .width,
    ).toBe('40%');
  });

  it('resizes the start pane on pointer drag', async () => {
    const wrapper = mountSplitter({ defaultSize: 278, minStart: 80, minEnd: 120 });
    const root = wrapper.find('.ant-folder-splitter').element;
    const start = wrapper.find('.ant-folder-splitter-start').element as HTMLElement;
    mockRect(root, 800);
    mockRect(start, 278);

    await wrapper.find('.ant-folder-splitter-bar').trigger('pointerdown', {
      clientX: 278,
      button: 0,
    });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 378 }));
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: 378 }));
    await nextTick();

    expect(start.style.width).toBe('378px');
    expect(wrapper.find('.ant-folder-splitter-bar').attributes('aria-valuenow')).toBe(
      '378',
    );
  });

  it('resizes the start pane on mouse drag', async () => {
    const wrapper = mountSplitter({ defaultSize: 200 });
    const root = wrapper.find('.ant-folder-splitter').element;
    const start = wrapper.find('.ant-folder-splitter-start').element as HTMLElement;
    mockRect(root, 800);
    mockRect(start, 200);

    await wrapper.find('.ant-folder-splitter-bar').trigger('mousedown', {
      clientX: 200,
      button: 0,
    });
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 260 }));
    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 260 }));
    await nextTick();

    expect(start.style.width).toBe('260px');
  });

  it('clamps drag to minStart and minEnd', async () => {
    const wrapper = mountSplitter({
      defaultSize: 200,
      minStart: 120,
      minEnd: 160,
    });
    const root = wrapper.find('.ant-folder-splitter').element;
    const start = wrapper.find('.ant-folder-splitter-start').element as HTMLElement;
    mockRect(root, 400);
    mockRect(start, 200);

    await wrapper.find('.ant-folder-splitter-bar').trigger('pointerdown', {
      clientX: 200,
      button: 0,
    });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 20 }));
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: 20 }));
    await nextTick();
    expect(start.style.width).toBe('120px');

    await wrapper.find('.ant-folder-splitter-bar').trigger('pointerdown', {
      clientX: 120,
      button: 0,
    });
    mockRect(start, 120);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 390 }));
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: 390 }));
    await nextTick();
    // 400 container - 6 handle - 160 minEnd = 234
    expect(start.style.width).toBe('234px');
  });

  it('supports keyboard resize', async () => {
    const wrapper = mountSplitter({ defaultSize: 278 });
    const root = wrapper.find('.ant-folder-splitter').element;
    const start = wrapper.find('.ant-folder-splitter-start').element as HTMLElement;
    mockRect(root, 800);
    mockRect(start, 278);
    const bar = wrapper.find('.ant-folder-splitter-bar');

    await bar.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    expect(start.style.width).toBe('286px');

    await bar.trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
    await nextTick();
    expect(start.style.width).toBe('254px');
  });

  it('inverts drag delta in rtl mode', async () => {
    const wrapper = mountSplitter({ defaultSize: 278, rtl: true });
    const root = wrapper.find('.ant-folder-splitter').element;
    const start = wrapper.find('.ant-folder-splitter-start').element as HTMLElement;
    mockRect(root, 800);
    mockRect(start, 278);

    await wrapper.find('.ant-folder-splitter-bar').trigger('pointerdown', {
      clientX: 522,
      button: 0,
    });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 572 }));
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: 572 }));
    await nextTick();

    expect(start.style.width).toBe('228px');
  });
});
