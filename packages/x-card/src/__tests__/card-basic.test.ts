import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { clearCatalogCache, registerCatalog, XCard } from '../index';

const CardText = defineComponent({
  name: 'CardText',
  props: { text: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h('p', { class: 'x-card-text' }, props.text || slots.default?.());
  },
});

const CardContainer = defineComponent({
  name: 'CardContainer',
  setup(_props, { slots }) {
    return () => h('div', { class: 'x-card-container' }, slots.default?.());
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
      {
        version: 'v0.9' as const,
        createSurface: { surfaceId: 'hello', catalogId: 'local://demo' },
      },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 'hello',
          components: [
            { id: 'root', component: 'CardText', text: 'Hello X Card' },
          ],
        },
      },
    ];

    const wrapper = mount(XCard.Box, {
      props: {
        commands,
        components: { CardText },
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

  it('skips self-referencing component ids instead of recursing forever', async () => {
    const commands = [
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 'cycle',
          components: [
            { id: 'root', component: 'CardContainer', children: ['root'] },
          ],
        },
      },
    ];

    const wrapper = mount(XCard.Box, {
      props: {
        commands,
        components: { CardContainer },
      },
      slots: {
        default: () => h(XCard.Card, { id: 'cycle' }),
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.findAll('.x-card-container')).toHaveLength(1);
    wrapper.unmount();
  });

  it('caps extremely deep component trees', async () => {
    const depth = 150;
    const nodeId = (index: number) => (index === 0 ? 'root' : `node-${index}`);
    const components = Array.from({ length: depth }, (_, index) => ({
      id: nodeId(index),
      component: 'CardContainer',
      ...(index < depth - 1 ? { children: [nodeId(index + 1)] } : {}),
    }));
    const commands = [
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 'deep',
          components,
        },
      },
    ];

    const wrapper = mount(XCard.Box, {
      props: {
        commands,
        components: { CardContainer },
      },
      slots: {
        default: () => h(XCard.Card, { id: 'deep' }),
      },
    });

    await nextTick();
    await nextTick();
    const rendered = wrapper.findAll('.x-card-container');
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(depth);
    wrapper.unmount();
  });
});
