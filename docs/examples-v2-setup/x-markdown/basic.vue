<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownBasicV2Setup' });

import { ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Flex, Input } from 'ant-design-vue';

const content = ref(`# Hello World

### Welcome to XMarkdown!

- Item 1
- Item 2
- Item 3

\`\`\`js
const a = 1;
\`\`\`
`);
</script>

<template>
  <a-flex vertical :gap="16">
    <a-input-text-area v-model:value="content" :rows="8" />
    <div class="x-markdown-demo-wrap">
      <XMarkdown :content="content" />
    </div>
  </a-flex>
</template>

<style scoped>
.x-markdown-demo-wrap {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  min-height: 120px;
}
</style>
