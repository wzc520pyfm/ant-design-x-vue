<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownAnimationV2Setup' });

import { onMounted, ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const full = `# 流式动画

这一段会**淡入**。

- 第一行
- 第二行
`;

const content = ref('');

onMounted(() => {
  let i = 0;
  const timer = setInterval(() => {
    i += 2;
    content.value = full.slice(0, i);
    if (i >= full.length) clearInterval(timer);
  }, 40);
});
</script>

<template>
  <XMarkdown
    class-name="x-markdown-light"
    :content="content"
    :streaming="{
      hasNextChunk: content.length < full.length,
      enableAnimation: true,
      animationConfig: { fadeDuration: 200, easing: 'ease-in-out' },
    }"
  />
</template>
