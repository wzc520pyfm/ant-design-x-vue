<script setup lang="ts">
defineOptions({ name: 'AXBubbleGptVisV2Setup' });

import { ref, watchEffect, onUnmounted } from 'vue';
import { Bubble } from 'ant-design-x-vue';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis) \n\n

Here's a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

| Year | Revenue |
|------|---------|
| 2013 | 59.3 |
| 2014 | 64.4 |
| 2015 | 68.9 |
| 2016 | 74.4 |
| 2017 | 82.7 |
| 2018 | 91.9 |
| 2019 | 99.1 |
| 2020 | 101.6 |
| 2021 | 114.4 |
| 2022 | 121 |
`;

const index = ref(text.length);
let timer: ReturnType<typeof setTimeout> | null = null;

const renderStream = () => {
  if (index.value >= text.length) {
    if (timer) clearTimeout(timer);
    return;
  }
  timer = setTimeout(() => {
    index.value += 5;
    renderStream();
  }, 20);
};

watchEffect(() => {
  if (index.value < text.length) {
    renderStream();
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

// 简单的 markdown 渲染
const renderMarkdown = (content: string) => {
  let html = content
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
  
  // 简单的表格处理
  const tableRegex = /\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (_, header, body) => {
    const headers = header.split('|').filter(Boolean).map((h: string) => `<th>${h.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table border="1" style="border-collapse: collapse;"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });
  
  return `<p>${html}</p>`;
};

const rerender = () => {
  index.value = 1;
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-button :style="{ alignSelf: 'flex-end' }" @click="rerender">Re-Render</a-button>

    <Bubble :content="text.slice(0, index)" variant="outlined">
      <template #content="{ content }">
        <a-typography>
          <div v-html="renderMarkdown(content as string)" />
        </a-typography>
      </template>
    </Bubble>
  </a-flex>
</template>
