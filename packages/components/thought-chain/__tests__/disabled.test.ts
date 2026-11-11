import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ThoughtChainItem from '../ThoughtChainItem.vue';

describe('ThoughtChainItem disabled', () => {
  it('does not invoke onClick and applies the disabled class', async () => {
    const onClick = vi.fn();
    const wrapper = mount(ThoughtChainItem, {
      props: {
        title: 'Step',
        disabled: true,
        onClick,
      },
    });

    expect(wrapper.classes()).toContain('ant-thought-chain-item-disabled');
    expect(wrapper.classes()).not.toContain('ant-thought-chain-item-click');
    await wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
