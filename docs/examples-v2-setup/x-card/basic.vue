<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { registerCatalog, XCard } from '@ant-design-x-vue/x-card';

registerCatalog({
  $id: 'local://x-card-docs',
  catalogId: 'local://x-card-docs',
  components: {
    Text: { type: 'object', properties: { text: { type: 'string' } } },
  },
});

const Text = defineComponent({
  name: 'Text',
  props: {
    text: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () => h('p', { style: { margin: 0, fontSize: '16px' } }, props.text || slots.default?.());
  },
});

const commands = [
  {
    version: 'v0.9' as const,
    createSurface: { surfaceId: 'docs-hello', catalogId: 'local://x-card-docs' },
  },
  {
    version: 'v0.9' as const,
    updateComponents: {
      surfaceId: 'docs-hello',
      components: [{ id: 'root', component: 'Text', text: 'Hello from @ant-design-x-vue/x-card' }],
    },
  },
];
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Text }">
    <XCard.Card id="docs-hello" />
  </XCard.Box>
</template>
