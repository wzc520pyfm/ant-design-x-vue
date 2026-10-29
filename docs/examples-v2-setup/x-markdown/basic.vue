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
    <div
      :style="{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: '4px',
        padding: '16px',
        minHeight: '120px',
      }"
    >
      <XMarkdown :class-name="markdownClass" :content="content" />
    </div>
  </a-flex>
</template>
