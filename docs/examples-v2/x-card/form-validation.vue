<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { registerCatalog, useXCardField, XCard, type ActionPayload } from '@ant-design-x-vue/x-card';

registerCatalog({
  $id: 'local://form-validation',
  catalogId: 'local://form-validation',
  components: {
    Column: { type: 'object' },
    EmailField: { type: 'object' },
    Submit: { type: 'object' },
  },
});

const Column = defineComponent({
  name: 'Column',
  setup(_, { slots }) {
    return () => h('form', { style: { display: 'grid', gap: '12px', maxWidth: '360px' }, onSubmit: (e: Event) => e.preventDefault() }, slots.default?.());
  },
});

const EmailField = defineComponent({
  name: 'EmailField',
  props: {
    onDataChange: { type: Function, default: undefined },
  },
  setup(props) {
    const field = useXCardField({
      path: '/form/email',
      onDataChange: props.onDataChange,
      rules: [
        { required: true, message: '请填写邮箱' },
        { pattern: /.+@.+\..+/, message: '邮箱格式不正确' },
      ],
    });
    return () =>
      h('label', { style: { display: 'grid', gap: '4px', fontSize: '14px' } }, [
        '邮箱',
        h('input', {
          value: field.value.value,
          style: { padding: '6px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' },
          onInput: (e: Event) => field.setValue((e.target as HTMLInputElement).value),
        }),
        field.error.value
          ? h('span', { style: { color: '#ff4d4f', fontSize: '12px' } }, field.error.value)
          : null,
      ]);
  },
});

const lastAction = ref<ActionPayload | null>(null);
const blocked = ref(false);

const Submit = defineComponent({
  name: 'Submit',
  props: {
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
        '提交',
      );
  },
});

const handleAction = (payload: ActionPayload) => {
  const email = payload.context.email;
  const value = email && typeof email === 'object' ? email.value : email;
  if (!value || !/.+@.+\..+/.test(String(value))) {
    blocked.value = true;
    return;
  }
  blocked.value = false;
  lastAction.value = payload;
};

const commands = [
  { version: 'v0.9' as const, createSurface: { surfaceId: 'form', catalogId: 'local://form-validation' } },
  {
    version: 'v0.9' as const,
    updateComponents: {
      surfaceId: 'form',
      components: [
        { id: 'root', component: 'Column', children: ['email', 'go'] },
        { id: 'email', component: 'EmailField' },
        {
          id: 'go',
          component: 'Submit',
          action: {
            event: {
              name: 'submit',
              context: { email: { path: '/form/email', label: '邮箱' } },
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
    <XCard.Box :commands="commands" :components="{ Column, EmailField, Submit }" :on-action="handleAction">
      <XCard.Card id="form" />
    </XCard.Box>
    <p v-if="blocked" style="color: #ff4d4f; margin-top: 12px">请先通过字段校验再提交。</p>
    <pre v-if="lastAction" style="margin-top: 16px; padding: 12px; background: #f6f6f6; border-radius: 8px">{{
      JSON.stringify(lastAction, null, 2)
    }}</pre>
  </div>
</template>
