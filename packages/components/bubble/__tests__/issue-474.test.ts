import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import BubbleList from '../BubbleList.vue';
import type { BubbleListProps } from '../interface';

const items: BubbleListProps['items'] = [
  { key: 'u1', role: 'ai', content: 'hello world' },
];

const itemsWithLegacyRenderer: BubbleListProps['items'] = [
  {
    key: 'u1',
    role: 'ai',
    content: 'hello world',
    messageRender: (content) =>
      h('div', { class: 'legacy-render' }, String(content)),
  },
];

const rolesWithContentRender: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    contentRender: (content) =>
      h('div', { class: 'role-render' }, String(content)),
  },
};

describe('BubbleList content slot (#474)', () => {
  it('renders the content slot instead of passing it to contentRender', () => {
    const wrapper = mount(BubbleList, {
      props: { items: itemsWithLegacyRenderer, roles: rolesWithContentRender },
      slots: {
        header: ({ item }: any) =>
          h('div', { class: 'header-json' }, JSON.stringify(item)),
        content: ({ item }: any) =>
          h('div', { class: 'custom-content' }, String(item.content)),
      },
    });

    expect(wrapper.find('.custom-content').text()).toBe('hello world');
    expect(wrapper.find('.role-render').exists()).toBe(false);
    expect(wrapper.find('.legacy-render').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('[object Object]');
    wrapper.unmount();
  });

  it('still applies contentRender when no content slot is provided', () => {
    const wrapper = mount(BubbleList, {
      props: { items, roles: rolesWithContentRender },
    });

    expect(wrapper.find('.role-render').text()).toBe('hello world');
    wrapper.unmount();
  });

  it('still applies deprecated messageRender when no content slot is provided', () => {
    const wrapper = mount(BubbleList, {
      props: { items: itemsWithLegacyRenderer },
    });

    expect(wrapper.find('.legacy-render').text()).toBe('hello world');
    wrapper.unmount();
  });
});
