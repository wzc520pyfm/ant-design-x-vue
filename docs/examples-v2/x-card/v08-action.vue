<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { XCard, type ActionPayload, type XAgentCommand_v0_8 } from '@ant-design-x-vue/x-card';

const Column = defineComponent({
  name: 'Column',
  setup(_, { slots }) {
    return () => h('div', { style: { display: 'grid', gap: '10px', maxWidth: '360px' } }, slots.default?.());
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
      h('label', { style: { display: 'grid', gap: '4px' } }, [
        props.label,
        h('input', {
          style: { padding: '6px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' },
          onInput: (e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            const context: Record<string, any> = {};
            const items = Array.isArray(props.action?.context) ? props.action.context : [];
            items.forEach((item: { key: string }) => {
              context[item.key] = value;
            });
            props.onAction?.(props.action?.name || 'change', context);
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
          style: { padding: '8px 12px', border: 0, borderRadius: '6px', background: '#1677ff', color: '#fff' },
          onClick: () => props.onAction?.(props.action?.name || 'submit', {}),
        },
        props.text,
      );
  },
});

const Preview = defineComponent({
  name: 'Preview',
  props: { text: { type: String, default: '' } },
  setup(props) {
    return () => h('p', { style: { margin: 0, color: '#1677ff' } }, props.text || '输入后点提交，Card 会按 v0.8 context path 回填');
  },
});

const lastAction = ref<ActionPayload | null>(null);

const commands: XAgentCommand_v0_8[] = [
  {
    surfaceUpdate: {
      surfaceId: 'v08-form',
      components: [
        { id: 'root', component: { Column: { children: ['name', 'go', 'preview'] } } },
        {
          id: 'name',
          component: {
            Field: {
              label: { literalString: '昵称' },
              action: { name: 'field-change', context: [{ key: 'nickname', value: { path: '/form/nickname' } }] },
            },
          },
        },
        {
          id: 'go',
          component: {
            Submit: {
              text: { literalString: '提交（空 context）' },
              action: { name: 'submit', context: [{ key: 'nickname', value: { path: '/form/nickname' } }] },
            },
          },
        },
        { id: 'preview', component: { Preview: { text: { path: '/form/nickname' } } } },
      ],
    },
  },
  { beginRendering: { surfaceId: 'v08-form', root: 'root' } },
];

const handleAction = (payload: ActionPayload) => {
  lastAction.value = payload;
};
</script>

<template>
  <div>
    <XCard.Box :commands="commands" :components="{ Column, Field, Submit, Preview }" :on-action="handleAction">
      <XCard.Card id="v08-form" />
    </XCard.Box>
    <pre v-if="lastAction" style="margin-top: 16px; padding: 12px; background: #f6f6f6; border-radius: 8px">{{
      JSON.stringify(lastAction, null, 2)
    }}</pre>
  </div>
</template>
