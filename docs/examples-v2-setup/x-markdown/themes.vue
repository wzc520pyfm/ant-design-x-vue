<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownThemesV2Setup' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';

const content = ['# Theme sample', '', 'Body text with a [link](https://x.ant.design).', '', '- one', '- two'].join('\n');
</script>

<template>
  <a-flex :gap="16" wrap="wrap">
    <div style="flex: 1 1 240px; padding: 12px; background: #fff">
      <XMarkdown class="x-markdown-light" class-name="x-markdown-light" :content="content" />
    </div>
    <div style="flex: 1 1 240px; padding: 12px; background: #141414">
      <XMarkdown class="x-markdown-dark" class-name="x-markdown-dark" :content="content" />
    </div>
  </a-flex>
</template>
