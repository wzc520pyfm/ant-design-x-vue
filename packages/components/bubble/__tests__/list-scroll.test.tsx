import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { Bubble, type BubbleListRef } from 'ant-design-x-vue';

describe('Bubble.List scroll layout', () => {
  it('renders every item in chronological order inside the scroll content', async () => {
    const wrapper = mount(Bubble.List, {
      props: {
        autoScroll: true,
        role: {
          ai: { typing: { step: 1, interval: 50 } },
        },
        items: [
          { key: 0, role: 'user', content: 'first' },
          { key: 'ai', role: 'ai', content: 'second' },
          { key: 'third', role: 'user', content: 'third' },
        ],
      },
    });
    await nextTick();

    const bubbles = wrapper.get('.ant-bubble-list-scroll-content').findAll('.ant-bubble');
    expect(bubbles).toHaveLength(3);
    expect(bubbles[0].text()).toContain('first');
    expect(bubbles[2].text()).toContain('third');
    expect(wrapper.get('.ant-bubble-list-scroll-box').classes()).toContain(
      'ant-bubble-list-autoscroll',
    );
    expect(wrapper.html()).not.toContain('role="[object Object]"');
    expect(wrapper.get('.ant-bubble-list').attributes('style') || '').not.toContain('height');

    const css = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent || '')
      .join('\n');
    expect(css).toMatch(/ant-bubble-list-scroll-content\{[^}]*flex-direction:column/);
    expect(css).toMatch(/ant-bubble-list-autoscroll\{[^}]*flex-direction:column-reverse/);

    wrapper.unmount();
  });

  it('keeps a caller height on the list so the scrollport can be bounded', async () => {
    const wrapper = mount(Bubble.List, {
      props: {
        style: { height: '320px' },
        items: [{ key: 1, content: 'bounded' }],
      },
    });
    await nextTick();
    expect(wrapper.get('.ant-bubble-list').attributes('style')).toContain('320px');
    wrapper.unmount();
  });

  it('scrolls the scroll box and still accepts key 0', async () => {
    const listRef = ref<BubbleListRef | null>(null);
    const Host = defineComponent({
      setup() {
        return () => (
          <Bubble.List
            ref={listRef}
            autoScroll={false}
            items={[
              { key: 0, content: 'top item' },
              { key: 1, content: 'bottom item' },
            ]}
          />
        );
      },
    });
    const wrapper = mount(Host);
    await nextTick();

    const scrollBox = wrapper.get('.ant-bubble-list-scroll-box').element as HTMLElement;
    expect(scrollBox.className).not.toContain('ant-bubble-list-autoscroll');
    const scrollTo = vi.spyOn(scrollBox, 'scrollTo').mockImplementation(() => {});
    const topBubble = wrapper.findAll('.ant-bubble')[0].element as HTMLElement;
    const intoView = vi.spyOn(topBubble, 'scrollIntoView').mockImplementation(() => {});

    listRef.value?.scrollTo({ key: 0, block: 'nearest' });
    expect(intoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'nearest' });
    expect(listRef.value?.scrollBoxNativeElement).toBe(scrollBox);
    expect(listRef.value?.nativeElement?.className).toContain('ant-bubble-list');

    listRef.value?.scrollTo({ top: 'bottom' });
    listRef.value?.scrollTo({ top: 'top' });
    listRef.value?.scrollTo({ offset: 12 });
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: expect.any(Number) }));

    wrapper.unmount();
  });
});
