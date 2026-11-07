import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Think from '../index';

describe('Think destroyOnHidden', () => {
  it('removes content from DOM when destroyOnHidden is true and collapsed', async () => {
    const wrapper = mount(Think, {
      props: {
        title: 'test',
        destroyOnHidden: true,
        defaultExpanded: false,
      },
      slots: {
        default: () => 'content',
      },
    });

    expect(wrapper.find('.ant-think-content').exists()).toBe(false);

    await wrapper.find('.ant-think-status-wrapper').trigger('click');
    await nextTick();
    expect(wrapper.find('.ant-think-content').exists()).toBe(true);
  });

  it('keeps content in DOM when destroyOnHidden is false and collapsed', async () => {
    const wrapper = mount(Think, {
      props: {
        title: 'test',
        destroyOnHidden: false,
        defaultExpanded: true,
      },
      slots: {
        default: () => 'content',
      },
    });

    expect(wrapper.find('.ant-think-content').exists()).toBe(true);

    await wrapper.find('.ant-think-status-wrapper').trigger('click');
    await nextTick();
    // leave transition may still be running; node should remain
    expect(wrapper.find('.ant-think-content').exists()).toBe(true);
    expect(wrapper.find('.ant-think-content-hidden').exists()).toBe(true);
  });
});
