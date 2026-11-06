<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { registerCatalog, XCard, type ActionPayload } from '@ant-design-x-vue/x-card';

registerCatalog({
  $id: 'local://action-context',
  catalogId: 'local://action-context',
  components: {
    Column: { type: 'object' },
    Field: { type: 'object', properties: { label: { type: 'string' }, action: { type: 'object' } } },
    Submit: { type: 'object', properties: { text: { type: 'string' }, action: { type: 'object' } } },
  },
});

const Column = defineComponent({
  name: 'Column',
  setup(_, { slots }) {
    return () => h('div', { style: { display: 'grid', gap: '12px', maxWidth: '360px' } }, slots.default?.());
  },
});

const Field = defineComponent({
  name: 'Field',
  props: {
    label: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h('label', { style: { display: 'grid', gap: '4px', fontSize: '14px' } }, [
        props.label,
        h('input', {
          style: { padding: '6px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' },
          onInput: (e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            const context: Record<string, any> = {};
            Object.keys(props.action?.event?.context || {}).forEach((key) => {
              context[key] = value;
            });
            props.onAction?.(props.action?.event?.name || 'change', context);
          },
        }),
      ]);
  },
});

const Submit = defineComponent({
  name: 'Submit',
  props: {
    text: { type: String, default: '提交' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          style: {
            padding: '8px 12px',
            border: 0,
            borderRadius: '6px',
            background: '#1677ff',
            color: '#fff',
            cursor: 'pointer',
          },
          onClick: () => props.onAction?.(props.action?.event?.name || 'submit', {}),
        },
        props.text,
      );
  },
});

const lastAction = ref<ActionPayload | null>(null);

const commands = [
  { version: 'v0.9' as const, createSurface: { surfaceId: 'form', catalogId: 'local://action-context' } },
  {
    version: 'v0.9' as const,
    updateComponents: {
      surfaceId: 'form',
      components: [
        { id: 'root', component: 'Column', children: ['username', 'email', 'go'] },
        {
          id: 'username',
          component: 'Field',
          label: '用户名',
          action: {
            event: {
              name: 'field-change',
              context: { username: { path: '/form/username', label: '用户名' } },
            },
          },
        },
        {
          id: 'email',
          component: 'Field',
          label: '邮箱',
          action: {
            event: {
              name: 'field-change',
              context: { email: { path: '/form/email', label: '邮箱' } },
            },
          },
        },
        {
          id: 'go',
          component: 'Submit',
          text: '提交（空 context，由 Card 解析 path）',
          action: {
            event: {
              name: 'submit',
              context: {
                username: { path: '/form/username', label: '用户名' },
                email: { path: '/form/email', label: '邮箱' },
              },
            },
          },
        },
      ],
    },
  },
];
</script>

<template>
  <div>
    <XCard.Box :commands="commands" :components="{ Column, Field, Submit }" :on-action="(p) => (lastAction = p)">
      <XCard.Card id="form" />
    </XCard.Box>
    <pre v-if="lastAction" style="margin-top: 16px; padding: 12px; background: #f6f6f6; border-radius: 8px">{{
      JSON.stringify(lastAction, null, 2)
    }}</pre>
  </div>
</template>
