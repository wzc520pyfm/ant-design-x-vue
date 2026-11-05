<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownLatexStreamingV2Setup' });

import { h, onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Latex from '@ant-design-x-vue/x-markdown/plugins/Latex';

const fullContent = `
### Latex

inline standard: $\\frac{df}{dt}$

block standard:

$$
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
$$

inline: \\(\\frac{df}{dt}\\)

block:

\\[
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
\\]
`;

const index = ref(0);
const isServer = import.meta.env.SSR;
const config = { extensions: Latex() };

watchEffect((onCleanup) => {
  if (isServer || index.value >= fullContent.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(fullContent.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = fullContent.length;
});

const renderContent = (content: unknown) =>
  h(XMarkdown, {
    content: String(content ?? ''),
    config,
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
      :content="fullContent.slice(0, index)"
      :content-render="renderContent"
      variant="outlined"
    />
  </a-flex>
</template>
