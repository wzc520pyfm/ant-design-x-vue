<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownWalkTokensV2Setup' });

import { XMarkdown, type Token } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = `Please check: [This is a link](https://xxxxx)`;
const message = 'Invalid link';

const walkTokens = (token: Token) => {
  if (token.type === 'link') {
    delete (token as any).tokens;
    token.raw = message;
    token.text = message;
    token.type = 'text';
  }
};

const config = { walkTokens };
</script>

<template>
  <XMarkdown class-name="x-markdown-light" :content="content" :config="config" />
</template>
