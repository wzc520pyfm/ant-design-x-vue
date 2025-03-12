<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import type { BubbleProps } from 'ant-design-x-vue';
import { Typography } from 'ant-design-vue';
import markdownit from 'markdown-it';
import { onWatcherCleanup, ref, watchEffect, h } from 'vue';

defineOptions({ name: 'AXBubbleMarkdownSetup' });

const md = markdownit({ html: true, breaks: true });

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown: BubbleProps['messageRender'] = (content) =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  });

const renderKey = ref(0);

watchEffect(() => {
  const id = setTimeout(() => {
    renderKey.value = renderKey.value + 1;
  }, text.length * 100 + 2000);
  onWatcherCleanup(() => {
    clearTimeout(id);
  });
});
</script>

<template>
  <div :style="{ height: 100 }" :key="renderKey">
    <Bubble
      :typing="true"
      :content="text"
      :messageRender="renderMarkdown"
      :avatar="{ icon: h(UserOutlined) }"
    />
  </div>
</template>
