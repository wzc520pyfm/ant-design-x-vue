<script setup lang="ts">
defineOptions({ name: 'AXBubbleMarkdownV2Setup' });

import { ref, watchEffect, h, type VNode } from 'vue';
import { Bubble, type BubbleProps } from 'ant-design-x-vue';

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const index = ref(text.length);

watchEffect((onCleanup) => {
  if (index.value < text.length) {
    const timerId = setTimeout(() => {
      index.value += 5;
    }, 20);
    onCleanup(() => clearTimeout(timerId));
  }
});

const rerender = () => {
  index.value = 1;
};

// 简单的 markdown 渲染
const renderContent = (content: string): string => {
  return content
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br />');
};
</script>

<template>
  <a-flex vertical :style="{ height: '150px' }" :gap="16">
    <a-flex>
      <a-button type="primary" @click="rerender">rerender</a-button>
    </a-flex>
    <a-flex>
      <Bubble :content="text.slice(0, index)">
        <template #content="{ content }">
          <a-typography>
            <div v-html="renderContent(content as string)" />
          </a-typography>
        </template>
      </Bubble>
    </a-flex>
  </a-flex>
</template>
