<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownSourcesV2Setup' });

import { h, onUnmounted, ref, watchEffect } from 'vue';
import { Bubble, Sources } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { textOf } from '../../examples-v2/_shared/markdown-code';

const text = `Ant Financial has a large number of enterprise-level products.<sup>1</sup> With complex scenarios, designers and developers often need to respond fast due to frequent changes in product demands and concurrent R & D workflow.<sup>2</sup> Many similar contents exist in the process. Through abstraction, we could obtain some stable and highly reusable components and pages.<sup>3</sup>`;

const items = [
  {
    title: '1. Data source',
    key: 1,
    url: 'https://x.ant.design/components/overview',
    description:
      'Artificial Intelligence, often abbreviated as AI, is a broad branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence.',
  },
  {
    title: '2. Data source',
    key: 2,
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '3. Data source',
    key: 3,
    url: 'https://x.ant.design/components/overview',
  },
];

const SupSource = (props: ComponentProps) => {
  const title = textOf(props.children) || '0';
  return h(Sources, {
    activeKey: parseInt(title, 10),
    title,
    items,
    inline: true,
  });
};

const index = ref(0);
const isServer = import.meta.env.SSR;
const components = { sup: SupSource };

watchEffect((onCleanup) => {
  if (isServer || index.value >= text.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(text.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = text.length;
});

const renderContent = (content: unknown) =>
  h(XMarkdown, {
    content: String(content ?? ''),
    components,
    paragraphTag: 'div',
  });

const restart = () => {
  index.value = 0;
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-button style="align-self: flex-end" @click="restart">Re-Render</a-button>
    <Bubble
      :content="text.slice(0, index)"
      :content-render="renderContent"
      variant="outlined"
    />
  </a-flex>
</template>
