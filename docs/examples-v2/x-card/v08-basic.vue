<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { XCard, type XAgentCommand_v0_8 } from '@ant-design-x-vue/x-card';

const Text = defineComponent({
  name: 'Text',
  props: { text: { type: String, default: '' } },
  setup(props) {
    return () => h('p', { style: { margin: 0, fontSize: '16px' } }, props.text);
  },
});

const Column = defineComponent({
  name: 'Column',
  setup(_, { slots }) {
    return () => h('div', { style: { display: 'grid', gap: '8px' } }, slots.default?.());
  },
});

const commands: XAgentCommand_v0_8[] = [
  {
    surfaceUpdate: {
      surfaceId: 'v08',
      components: [
        { id: 'root', component: { Column: { children: ['hello', 'hint'] } } },
        { id: 'hello', component: { Text: { text: { path: '/title' } } } },
        { id: 'hint', component: { Text: { text: { literalString: '这段来自 v0.8 literalString' } } } },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'v08',
      contents: [{ key: 'title', valueString: 'Hello from A2UI v0.8' }],
    },
  },
  { beginRendering: { surfaceId: 'v08', root: 'root' } },
];
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Text, Column }">
    <XCard.Card id="v08" />
  </XCard.Box>
</template>
