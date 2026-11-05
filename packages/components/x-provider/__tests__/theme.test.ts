import { mount } from '@vue/test-utils';
import { theme } from 'ant-design-vue';
import { defineComponent, h, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import XProvider from '../index.vue';

const Probe = defineComponent({
  name: 'ThemeProbe',
  setup() {
    const { token } = theme.useToken();
    return () => h('div', {
      class: 'probe',
      'data-bg': token.value.colorBgContainer,
      'data-layout': token.value.colorBgLayout,
    });
  },
});

describe('XProvider theme', () => {
  it('follows algorithm changes from light to dark and back', async () => {
    const dark = ref(false);
    const Host = defineComponent({
      setup() {
        return () => h(XProvider, {
          theme: {
            algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
          },
        }, {
          default: () => h(Probe),
        });
      },
    });
    const wrapper = mount(Host);
    const read = () => wrapper.get('.probe').attributes();
    expect(read()['data-bg']?.toLowerCase()).toBe('#ffffff');
    expect(read()['data-layout']?.toLowerCase()).toBe('#f5f5f5');

    dark.value = true;
    await wrapper.vm.$nextTick();
    expect(read()['data-layout']?.toLowerCase()).toBe('#000000');
    expect(read()['data-bg']?.toLowerCase()).toBe('#141414');

    dark.value = false;
    await wrapper.vm.$nextTick();
    expect(read()['data-bg']?.toLowerCase()).toBe('#ffffff');
  });

  it('lets a nested provider inherit a parent algorithm change', async () => {
    const dark = ref(true);
    const Host = defineComponent({
      setup() {
        return () => h(XProvider, {
          theme: {
            algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
          },
        }, {
          default: () => h(XProvider, null, { default: () => h(Probe) }),
        });
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.get('.probe').attributes('data-bg')?.toLowerCase()).toBe('#141414');
    dark.value = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.get('.probe').attributes('data-bg')?.toLowerCase()).toBe('#ffffff');
  });
});
