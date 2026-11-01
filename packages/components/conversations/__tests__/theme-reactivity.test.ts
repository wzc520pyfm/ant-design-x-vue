import { FastColor } from '@ant-design/fast-color';
import { mount } from '@vue/test-utils';
import { theme } from 'ant-design-vue';
import { defineComponent, h, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import BasicDemo from '../../../../docs/examples-v2/conversations/basic.vue';
import XProvider from '../../x-provider/index.vue';
import Conversations from '../index';

function hashClass(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('.ant-conversations').classes().find((name) => name.startsWith('css-')) ?? '';
}

function cssFor(hash: string) {
  return Array.from(document.querySelectorAll('style'))
    .map((node) => node.textContent || '')
    .filter((css) => css.includes(hash))
    .join('\n');
}

function decl(css: string, selector: string, property: string) {
  const matched = css.match(new RegExp(`${selector}\\{[^}]*${property}:([^;}]+)`));
  return matched?.[1]?.replace(/\s+/g, '') ?? '';
}

describe('Conversations theme reactivity', () => {
  it('recomputes creation colors when the algorithm changes', async () => {
    const dark = ref(false);
    const Host = defineComponent({
      setup() {
        return () => h(XProvider, {
          theme: {
            algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
          },
        }, {
          default: () => h(Conversations, {
            creation: { onClick: () => {} },
            defaultActiveKey: '1',
            items: [
              { key: '1', label: 'Conversation - 1' },
              { key: '2', label: 'Conversation - 2' },
            ],
          }),
        });
      },
    });

    const wrapper = mount(Host);
    const read = () => {
      const css = cssFor(hashClass(wrapper));
      const primary = decl(css, '\\.ant-conversations-creation', 'color');
      return {
        primary,
        creationBg: decl(css, '\\.ant-conversations-creation', 'background-color'),
        label: decl(css, '\\.ant-conversations-label', 'color'),
      };
    };

    const light = read();
    expect(light.primary.toLowerCase()).toBe('#1677ff');
    expect(light.creationBg).toBe(new FastColor(light.primary).setA(0.15).toRgbString().replace(/\s+/g, ''));
    expect(light.label).toContain('0,0,0');

    dark.value = true;
    await wrapper.vm.$nextTick();
    const darkColors = read();
    expect(darkColors.primary.toLowerCase()).not.toBe(light.primary.toLowerCase());
    expect(darkColors.creationBg).toBe(
      new FastColor(darkColors.primary).setA(0.15).toRgbString().replace(/\s+/g, ''),
    );
    expect(darkColors.creationBg).not.toBe(light.creationBg);
    expect(darkColors.label).toContain('255,255,255');

    dark.value = false;
    await wrapper.vm.$nextTick();
    expect(read().creationBg).toBe(light.creationBg);
    expect(read().label).toContain('0,0,0');

    wrapper.unmount();
  });

  it('applies a Conversations component token override when it changes', async () => {
    const creationBgColor = ref('rgb(1, 2, 3)');
    const Host = defineComponent({
      setup() {
        return () => h(XProvider, {
          theme: {
            components: {
              Conversations: { creationBgColor: creationBgColor.value },
            },
          },
        }, {
          default: () => h(Conversations, {
            creation: { onClick: () => {} },
            items: [{ key: '1', label: 'Conversation - 1' }],
          }),
        });
      },
    });

    const wrapper = mount(Host);
    const readBg = () => decl(
      cssFor(hashClass(wrapper)),
      '\\.ant-conversations-creation',
      'background-color',
    );

    expect(readBg()).toBe('rgb(1,2,3)');
    creationBgColor.value = 'rgb(9, 8, 7)';
    await wrapper.vm.$nextTick();
    expect(readBg()).toBe('rgb(9,8,7)');
    wrapper.unmount();
  });

  it('updates the docs demo container background with the algorithm', async () => {
    const dark = ref(false);
    const Host = defineComponent({
      setup() {
        return () => h(XProvider, {
          theme: {
            algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
          },
        }, {
          default: () => h(BasicDemo),
        });
      },
    });
    const wrapper = mount(Host);
    const background = () => wrapper.get('.ant-conversations').attributes('style') ?? '';
    expect(background().toLowerCase()).toContain('#ffffff');

    dark.value = true;
    await wrapper.vm.$nextTick();
    expect(background().toLowerCase()).toContain('#141414');
    expect(background().toLowerCase()).not.toContain('#ffffff');

    dark.value = false;
    await wrapper.vm.$nextTick();
    expect(background().toLowerCase()).toContain('#ffffff');
    wrapper.unmount();
  });
});
