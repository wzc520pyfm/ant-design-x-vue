import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { computed, defineComponent, h, ref } from 'vue';
import BasicDemo from '../../../../docs/examples-v2/conversations/basic.vue';
import Conversations from '../index';

describe('Conversations item disabled toggle', () => {
  it('updates item disabled class when items[].disabled flips', async () => {
    const disabled = ref(true);
    const Host = defineComponent({
      setup() {
        const items = computed(() => [
          { key: 'a', label: 'A' },
          { key: 'deepSearch', label: 'Deep Search', disabled: disabled.value },
        ]);
        return () =>
          h(Conversations, {
            defaultActiveKey: 'a',
            items: items.value,
          });
      },
    });

    const wrapper = mount(Host);
    const deep = () => wrapper.findAll('.ant-conversations-item').at(1)!;

    expect(deep().classes()).toContain('ant-conversations-item-disabled');

    disabled.value = false;
    await wrapper.vm.$nextTick();
    expect(deep().classes()).not.toContain('ant-conversations-item-disabled');

    disabled.value = true;
    await wrapper.vm.$nextTick();
    expect(deep().classes()).toContain('ant-conversations-item-disabled');

    wrapper.unmount();
  });

  it('basic docs demo enables Deep Search when Switch turns on', async () => {
    const wrapper = mount(BasicDemo);
    const deep = wrapper.findAll('.ant-conversations-item').at(3)!;

    expect(deep.classes()).toContain('ant-conversations-item-disabled');

    const sw = deep.find('.ant-switch');
    expect(sw.exists()).toBe(true);
    expect(sw.classes()).not.toContain('ant-switch-checked');

    await sw.trigger('click');
    await wrapper.vm.$nextTick();

    expect(deep.classes()).not.toContain('ant-conversations-item-disabled');
    expect(sw.classes()).toContain('ant-switch-checked');

    await sw.trigger('click');
    await wrapper.vm.$nextTick();
    expect(deep.classes()).toContain('ant-conversations-item-disabled');
    expect(sw.classes()).not.toContain('ant-switch-checked');

    wrapper.unmount();
  });
});
