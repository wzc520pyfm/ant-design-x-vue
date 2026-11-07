import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { clearCatalogCache, registerCatalog, XCard } from '../index';

const Text = defineComponent({
  name: 'Text',
  props: { text: { type: String, default: '' } },
  setup(props) {
    return () => h('p', { class: 'x-card-text' }, props.text);
  },
});

const Wrap = defineComponent({
  name: 'Wrap',
  setup(_, { slots }) {
    return () => h('div', { class: 'x-card-wrap' }, slots.default?.());
  },
});

const Count = defineComponent({
  name: 'Count',
  props: { cart: { type: Array, default: () => [] } },
  setup(props) {
    return () => h('span', { class: 'cart-count' }, String((props.cart as unknown[]).length));
  },
});

const Add = defineComponent({
  name: 'Add',
  props: {
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          class: 'add-btn',
          type: 'button',
          onClick: () => props.onAction?.(props.action?.event?.name || 'add', { product: { id: 1 } }),
        },
        'add',
      );
  },
});

async function flush() {
  await nextTick();
  await nextTick();
}

describe('x-card showcase leftovers', () => {
  it('syncs sibling cards through a shared /cart dataModel', async () => {
    registerCatalog({
      $id: 'local://shop',
      catalogId: 'local://shop',
      components: { Wrap: { type: 'object' }, Count: { type: 'object' }, Add: { type: 'object' } },
    });
    const commands = ref<any[]>([
      { version: 'v0.9', createSurface: { surfaceId: 'shop', catalogId: 'local://shop' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'shop',
          components: [
            { id: 'root', component: 'Wrap', children: ['add', 'count'] },
            {
              id: 'add',
              component: 'Add',
              action: { event: { name: 'add', context: { product: {} } } },
            },
            { id: 'count', component: 'Count', cart: { path: '/cart' } },
          ],
        },
      },
      { version: 'v0.9', updateDataModel: { surfaceId: 'shop', path: '/', value: { cart: [] } } },
    ]);
    const wrapper = mount(XCard.Box, {
      props: {
        commands: commands.value,
        components: { Wrap, Count, Add },
        onAction: (payload) => {
          if (payload.name !== 'add') return;
          commands.value = [
            ...commands.value,
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'shop',
                path: '/cart',
                value: [{ product: payload.context.product, quantity: 1 }],
              },
            },
          ];
          wrapper.setProps({ commands: commands.value });
        },
      },
      slots: { default: () => h(XCard.Card, { id: 'shop' }) },
    });
    await flush();
    expect(wrapper.find('.cart-count').text()).toBe('0');
    await wrapper.find('.add-btn').trigger('click');
    await flush();
    expect(wrapper.find('.cart-count').text()).toBe('1');
    wrapper.unmount();
    clearCatalogCache();
  });

  it('keeps two surfaces independent when only one dataModel updates', async () => {
    registerCatalog({
      $id: 'local://pair',
      catalogId: 'local://pair',
      components: { Text: { type: 'object' } },
    });
    const commands = ref<any[]>([
      { version: 'v0.9', createSurface: { surfaceId: 'left', catalogId: 'local://pair' } },
      { version: 'v0.9', createSurface: { surfaceId: 'right', catalogId: 'local://pair' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'left',
          components: [{ id: 'root', component: 'Text', text: { path: '/title' } }],
        },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'right',
          components: [{ id: 'root', component: 'Text', text: { path: '/title' } }],
        },
      },
      { version: 'v0.9', updateDataModel: { surfaceId: 'left', path: '/title', value: 'L' } },
      { version: 'v0.9', updateDataModel: { surfaceId: 'right', path: '/title', value: 'R' } },
    ]);
    const wrapper = mount(XCard.Box, {
      props: { commands: commands.value, components: { Text } },
      slots: {
        default: () => [h(XCard.Card, { id: 'left' }), h(XCard.Card, { id: 'right' })],
      },
    });
    await flush();
    const texts = wrapper.findAll('.x-card-text');
    expect(texts).toHaveLength(2);
    expect(texts[0].text()).toBe('L');
    expect(texts[1].text()).toBe('R');
    commands.value = [
      ...commands.value,
      { version: 'v0.9', updateDataModel: { surfaceId: 'left', path: '/title', value: 'L2' } },
    ];
    await wrapper.setProps({ commands: commands.value });
    await flush();
    const next = wrapper.findAll('.x-card-text');
    expect(next[0].text()).toBe('L2');
    expect(next[1].text()).toBe('R');
    wrapper.unmount();
    clearCatalogCache();
  });

  it('clears a surface on deleteSurface', async () => {
    registerCatalog({
      $id: 'local://del',
      catalogId: 'local://del',
      components: { Text: { type: 'object' } },
    });
    const commands = ref<any[]>([
      { version: 'v0.9', createSurface: { surfaceId: 'gone', catalogId: 'local://del' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'gone',
          components: [{ id: 'root', component: 'Text', text: 'visible' }],
        },
      },
    ]);
    const wrapper = mount(XCard.Box, {
      props: { commands: commands.value, components: { Text } },
      slots: { default: () => h(XCard.Card, { id: 'gone' }) },
    });
    await flush();
    expect(wrapper.find('.x-card-text').text()).toBe('visible');
    commands.value = [
      ...commands.value,
      { version: 'v0.9', deleteSurface: { surfaceId: 'gone' } },
    ];
    await wrapper.setProps({ commands: commands.value });
    await flush();
    expect(wrapper.find('.x-card-text').exists()).toBe(false);
    wrapper.unmount();
    clearCatalogCache();
  });

  it('replaces the component tree when updateComponents is appended (progressive)', async () => {
    registerCatalog({
      $id: 'local://prog',
      catalogId: 'local://prog',
      components: { Wrap: { type: 'object' }, Text: { type: 'object' } },
    });
    const commands = ref<any[]>([
      { version: 'v0.9', createSurface: { surfaceId: 'prog', catalogId: 'local://prog' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'prog',
          components: [
            { id: 'root', component: 'Wrap', children: ['a'] },
            { id: 'a', component: 'Text', text: 'one' },
          ],
        },
      },
    ]);
    const wrapper = mount(XCard.Box, {
      props: { commands: commands.value, components: { Wrap, Text } },
      slots: { default: () => h(XCard.Card, { id: 'prog' }) },
    });
    await flush();
    expect(wrapper.findAll('.x-card-text')).toHaveLength(1);
    commands.value = [
      ...commands.value,
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'prog',
          components: [
            { id: 'root', component: 'Wrap', children: ['a', 'b'] },
            { id: 'a', component: 'Text', text: 'one' },
            { id: 'b', component: 'Text', text: 'two' },
          ],
        },
      },
    ];
    await wrapper.setProps({ commands: commands.value });
    await flush();
    expect(wrapper.findAll('.x-card-text').map((n) => n.text())).toEqual(['one', 'two']);
    wrapper.unmount();
    clearCatalogCache();
  });
});
