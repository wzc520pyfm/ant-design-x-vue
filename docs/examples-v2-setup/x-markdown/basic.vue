<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownBasicV2Setup' });

import { computed, ref } from 'vue';
import { Flex, Input, theme } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { isDarkColor } from '../../examples-v2/_shared/playground-shell';

const { token } = theme.useToken();
const markdownClass = computed(() => (
  isDarkColor(token.value.colorBgContainer) ? 'x-markdown-dark' : 'x-markdown-light'
));

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
      <XMarkdown :class-name="markdownClass" :content="content" />
    </div>
  </a-flex>
</template>

<style scoped>
.x-markdown-demo-wrap {
  border: 1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06));
  border-radius: 4px;
  padding: 16px;
  min-height: 120px;
}
</style>
