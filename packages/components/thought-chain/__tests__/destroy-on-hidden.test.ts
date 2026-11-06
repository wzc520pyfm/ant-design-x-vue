import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import ThoughtChain from '../index';

describe('ThoughtChain destroyOnHidden', () => {
  it('removes content from DOM when destroyOnHidden is true and collapsed', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          {
            key: 'destroy-test',
            title: 'Collapsible',
            content: 'Destroyable content',
            collapsible: true,
            destroyOnHidden: true,
          },
        ],
        expandedKeys: [],
      },
    });

    await nextTick();
    expect(wrapper.find('.ant-thought-chain-node-content').exists()).toBe(false);
  });

  it('keeps content in DOM when destroyOnHidden is false and collapsed', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          {
            key: 'keep-test',
            title: 'Collapsible',
            content: 'Kept content',
            collapsible: true,
            destroyOnHidden: false,
          },
        ],
        expandedKeys: ['keep-test'],
      },
    });

    await nextTick();
    expect(wrapper.find('.ant-thought-chain-node-content').exists()).toBe(true);

    await wrapper.setProps({
      items: [
        {
          key: 'keep-test',
          title: 'Collapsible',
          content: 'Kept content',
          collapsible: true,
          destroyOnHidden: false,
        },
      ],
      expandedKeys: [],
    });
    await nextTick();

    expect(wrapper.find('.ant-thought-chain-node-content').exists()).toBe(true);
  });

  it('defaults to destroying content when collapsed', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          {
            key: 'default-test',
            title: 'Collapsible',
            content: 'Default destroy',
            collapsible: true,
          },
        ],
        expandedKeys: [],
      },
    });

    await nextTick();
    expect(wrapper.find('.ant-thought-chain-node-content').exists()).toBe(false);
  });
});
