import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { clearCatalogCache, registerCatalog, XCard } from '../index';

const Text = defineComponent({
  name: 'Text',
  props: { text: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('p', { class: 'x-card-text' }, props.text || slots.default?.());
  },
});

describe('XCard basic surface', () => {
  it('renders a v0.9 Text tree from commands', async () => {
    registerCatalog({
      $id: 'local://demo',
      catalogId: 'local://demo',
      components: { Text: { type: 'object' } },
    });

    const commands = [
      { version: 'v0.9' as const, createSurface: { surfaceId: 'hello', catalogId: 'local://demo' } },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 'hello',
          components: [{ id: 'root', component: 'Text', text: 'Hello X Card' }],
        },
      },
    ];

    const wrapper = mount(XCard.Box, {
      props: {
        commands,
        components: { Text },
      },
      slots: {
        default: () => h(XCard.Card, { id: 'hello' }),
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.find('.x-card-text').text()).toBe('Hello X Card');
    wrapper.unmount();
    clearCatalogCache();
  });
});
