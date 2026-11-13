import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import BubbleList from '../BubbleList.vue';
import type { BubbleListProps } from '../interface';

const items: BubbleListProps['items'] = [
  { key: 'u1', role: 'ai', content: 'hello world' },
];

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    messageRender: (content) =>
      h('div', { class: 'role-render' }, String(content)),
  },
};

describe('BubbleList message slot (#474)', () => {
  it('renders the slot output instead of passing it to messageRender', () => {
    const wrapper = mount(BubbleList, {
      props: { items, roles },
      slots: {
        header: ({ item }: any) =>
          h('div', { class: 'header-json' }, JSON.stringify(item)),
        message: ({ item }: any) =>
          h('div', { class: 'custom-message' }, String(item.content)),
      },
    });

    expect(wrapper.find('.custom-message').text()).toBe('hello world');
    expect(wrapper.find('.role-render').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('[object Object]');
    wrapper.unmount();
  });

  it('still applies messageRender when no message slot is provided', () => {
    const wrapper = mount(BubbleList, {
      props: { items, roles },
    });

    expect(wrapper.find('.role-render').text()).toBe('hello world');
    wrapper.unmount();
  });
});
