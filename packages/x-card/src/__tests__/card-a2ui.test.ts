import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { clearCatalogCache, registerCatalog, XCard } from '../index';
import { extractDataUpdatesV09, resolvePropsV09 } from '../Card.v0.9';
import { applyDataModelUpdateV08, extractDataUpdatesV08, resolvePropsV08 } from '../Card.v0.8';

const Text = defineComponent({
  name: 'Text',
  props: { text: { type: String, default: '' } },
  setup(props) {
    return () => h('p', { class: 'x-card-text' }, props.text);
  },
});

const Field = defineComponent({
  name: 'Field',
  props: {
    label: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
    onDataChange: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h('input', {
        class: 'x-card-field',
        'data-label': props.label,
        onInput: (e: Event) => {
          const value = (e.target as HTMLInputElement).value;
          const ctx: Record<string, any> = {};
          if (props.action?.event?.context) {
            for (const key of Object.keys(props.action.event.context)) {
              ctx[key] = value;
            }
          }
          props.onAction?.(props.action?.event?.name || 'change', ctx);
        },
      });
  },
});

const Submit = defineComponent({
  name: 'Submit',
  props: {
    text: { type: String, default: 'Submit' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          class: 'x-card-submit',
          type: 'button',
          onClick: () => props.onAction?.(props.action?.event?.name || 'submit', {}),
        },
        props.text,
      );
  },
});

const Column = defineComponent({
  name: 'Column',
  setup(_, { slots }) {
    return () => h('div', { class: 'x-card-column' }, slots.default?.());
  },
});

async function flush() {
  await nextTick();
  await nextTick();
}

describe('x-card A2UI deepen', () => {
  it('resolves bound text from v0.9 updateDataModel', async () => {
    registerCatalog({
      $id: 'local://bind',
      catalogId: 'local://bind',
      components: { Text: { type: 'object' } },
    });
    const commands = [
      { version: 'v0.9' as const, createSurface: { surfaceId: 's', catalogId: 'local://bind' } },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 's',
          components: [{ id: 'root', component: 'Text', text: { path: '/hello' } }],
        },
      },
      { version: 'v0.9' as const, updateDataModel: { surfaceId: 's', path: '/hello', value: 'streamed' } },
    ];
    const wrapper = mount(XCard.Box, {
      props: { commands, components: { Text } },
      slots: { default: () => h(XCard.Card, { id: 's' }) },
    });
    await flush();
    expect(wrapper.find('.x-card-text').text()).toBe('streamed');
    wrapper.unmount();
    clearCatalogCache();
  });

  it('writes field values then resolves empty submit context from dataModel', async () => {
    registerCatalog({
      $id: 'local://form',
      catalogId: 'local://form',
      components: {
        Column: { type: 'object' },
        Field: { type: 'object' },
        Submit: { type: 'object' },
      },
    });
    const payloads: any[] = [];
    const commands = [
      { version: 'v0.9' as const, createSurface: { surfaceId: 'form', catalogId: 'local://form' } },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 'form',
          components: [
            { id: 'root', component: 'Column', children: ['name', 'go'] },
            {
              id: 'name',
              component: 'Field',
              label: 'Name',
              action: {
                event: {
                  name: 'field-change',
                  context: { username: { path: '/form/username', label: '用户名' } },
                },
              },
            },
            {
              id: 'go',
              component: 'Submit',
              text: 'Go',
              action: {
                event: {
                  name: 'submit',
                  context: {
                    username: { path: '/form/username', label: '用户名' },
                    note: 'ok',
                  },
                },
              },
            },
          ],
        },
      },
    ];
    const wrapper = mount(XCard.Box, {
      props: {
        commands,
        components: { Column, Field, Submit },
        onAction: (p: any) => payloads.push(p),
      },
      slots: { default: () => h(XCard.Card, { id: 'form' }) },
    });
    await flush();
    await wrapper.find('.x-card-field').setValue('Ada');
    await flush();
    await wrapper.find('.x-card-submit').trigger('click');
    await flush();
    const submit = payloads.find((p) => p.name === 'submit');
    expect(submit).toBeTruthy();
    expect(submit.context.username).toEqual({ label: '用户名', value: 'Ada' });
    expect(submit.context.note).toBe('ok');
    wrapper.unmount();
    clearCatalogCache();
  });

  it('injects onDataChange so custom fields can write the model', async () => {
    const Writer = defineComponent({
      name: 'Writer',
      props: {
        onDataChange: { type: Function, default: undefined },
      },
      setup(props) {
        return () =>
          h(
            'button',
            {
              class: 'x-card-writer',
              onClick: () => props.onDataChange?.('/form/note', 'via-hook'),
            },
            'write',
          );
      },
    });
    const Reader = defineComponent({
      name: 'Reader',
      props: { text: { type: String, default: '' } },
      setup(props) {
        return () => h('span', { class: 'x-card-reader' }, props.text);
      },
    });
    const Wrap = defineComponent({
      name: 'Wrap',
      setup(_, { slots }) {
        return () => h('div', slots.default?.());
      },
    });
    registerCatalog({
      $id: 'local://dc',
      catalogId: 'local://dc',
      components: { Wrap: { type: 'object' }, Writer: { type: 'object' }, Reader: { type: 'object' } },
    });
    const commands = [
      { version: 'v0.9' as const, createSurface: { surfaceId: 'dc', catalogId: 'local://dc' } },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 'dc',
          components: [
            { id: 'root', component: 'Wrap', children: ['w', 'r'] },
            { id: 'w', component: 'Writer' },
            { id: 'r', component: 'Reader', text: { path: '/form/note' } },
          ],
        },
      },
    ];
    const wrapper = mount(XCard.Box, {
      props: { commands, components: { Wrap, Writer, Reader } },
      slots: { default: () => h(XCard.Card, { id: 'dc' }) },
    });
    await flush();
    await wrapper.find('.x-card-writer').trigger('click');
    await flush();
    expect(wrapper.find('.x-card-reader').text()).toBe('via-hook');
    wrapper.unmount();
    clearCatalogCache();
  });

  it('applies v0.8 dataModelUpdate + beginRendering', async () => {
    const commands = [
      {
        surfaceUpdate: {
          surfaceId: 'v8',
          components: [
            { id: 'root', component: { Text: { text: { path: '/title' } } } },
          ],
        },
      },
      {
        dataModelUpdate: {
          surfaceId: 'v8',
          contents: [{ key: 'title', valueString: 'from-v08' }],
        },
      },
      { beginRendering: { surfaceId: 'v8', root: 'root' } },
    ];
    const wrapper = mount(XCard.Box, {
      props: { commands, components: { Text } },
      slots: { default: () => h(XCard.Card, { id: 'v8' }) },
    });
    await flush();
    expect(wrapper.find('.x-card-text').text()).toBe('from-v08');
    wrapper.unmount();
  });
});

describe('versioned helpers', () => {
  it('resolvePropsV09 keeps action.event.context paths', () => {
    const result = resolvePropsV09(
      {
        name: { path: '/user/name' },
        action: { event: { name: 'go', context: { userName: { path: '/user/name' } } } },
      },
      { user: { name: 'Ada' } },
    );
    expect(result.name).toBe('Ada');
    expect(result.action.event.context.userName).toEqual({ path: '/user/name' });
  });

  it('extractDataUpdatesV09 reads component context', () => {
    expect(
      extractDataUpdatesV09(
        { event: { context: { username: { path: '/form/username' } } } },
        { username: 'Ada' },
      ),
    ).toEqual([{ path: '/form/username', value: 'Ada' }]);
  });

  it('resolvePropsV08 keeps action.context write targets', () => {
    const result = resolvePropsV08(
      {
        text: { literalString: 'Hi' },
        action: { name: 'go', context: [{ key: 'title', value: { path: '/title' } }] },
      },
      { title: 'T' },
    );
    expect(result.text).toBe('Hi');
    expect(result.action.context[0].value).toEqual({ path: '/title' });
  });

  it('extractDataUpdatesV08 and applyDataModelUpdateV08', () => {
    expect(
      extractDataUpdatesV08(
        { context: [{ key: 'title', value: { path: '/title' } }] },
        { title: 'X' },
      ),
    ).toEqual([{ path: '/title', value: 'X' }]);
    expect(
      applyDataModelUpdateV08({}, [
        { key: 'title', valueString: 'A' },
        { key: 'res', valueMap: [{ key: 'time', valueString: 'now' }] },
      ]),
    ).toEqual({ title: 'A', res: { time: 'now' } });
  });
});
