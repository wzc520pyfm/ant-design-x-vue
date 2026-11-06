<script setup lang="ts">
import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue';
import { registerCatalog, XCard, type XAgentCommand_v0_9 } from '@ant-design-x-vue/x-card';

registerCatalog({
  $id: 'local://streaming',
  catalogId: 'local://streaming',
  components: {
    Column: { type: 'object' },
    Text: { type: 'object', properties: { text: { type: 'string' } } },
    List: { type: 'object', properties: { items: { type: 'array' } } },
  },
});

const Column = defineComponent({
  name: 'Column',
  setup(_, { slots }) {
    return () => h('div', { style: { display: 'grid', gap: '8px' } }, slots.default?.());
  },
});

const Text = defineComponent({
  name: 'Text',
  props: { text: { type: String, default: '' } },
  setup(props) {
    return () => h('p', { style: { margin: 0, minHeight: '1.5em' } }, props.text);
  },
});

const List = defineComponent({
  name: 'List',
  props: { items: { type: Array, default: () => [] } },
  setup(props) {
    return () =>
      h(
        'ul',
        { style: { margin: 0, paddingLeft: '20px' } },
        (props.items as string[]).map((item) => h('li', { key: item }, item)),
      );
  },
});

const fullText = '正在为你检索咖啡馆：先看评分，再看步行距离，最后给出推荐。';
const fullItems = ['蓝瓶 · 4.8 · 120m', '看见咖啡 · 4.6 · 240m', '角落咖啡 · 4.5 · 380m'];

const commands = ref<XAgentCommand_v0_9[]>([
  { version: 'v0.9', createSurface: { surfaceId: 'stream', catalogId: 'local://streaming' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'stream',
      components: [
        { id: 'root', component: 'Column', children: ['intro', 'places'] },
        { id: 'intro', component: 'Text', text: { path: '/intro' } },
        { id: 'places', component: 'List', items: { path: '/items' } },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'stream', path: '/intro', value: '' } },
  { version: 'v0.9', updateDataModel: { surfaceId: 'stream', path: '/items', value: [] } },
]);

let timer: number | undefined;
onMounted(() => {
  let i = 0;
  timer = window.setInterval(() => {
    i += 1;
    const next: XAgentCommand_v0_9[] = [];
    if (i <= fullText.length) {
      next.push({
        version: 'v0.9',
        updateDataModel: { surfaceId: 'stream', path: '/intro', value: fullText.slice(0, i) },
      });
    }
    const itemCount = Math.min(fullItems.length, Math.floor(i / 12));
    next.push({
      version: 'v0.9',
      updateDataModel: { surfaceId: 'stream', path: '/items', value: fullItems.slice(0, itemCount) },
    });
    commands.value = [...commands.value, ...next];
    if (i >= fullText.length && itemCount >= fullItems.length) {
      window.clearInterval(timer);
    }
  }, 40);
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Column, Text, List }">
    <XCard.Card id="stream" />
  </XCard.Box>
</template>
