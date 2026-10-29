<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownOpenLinksV2Setup' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = '普通链接 [Ant Design X](https://x.ant.design) 会在新标签页打开。\n\n'
  + '<scr' + 'ipt>alert("xss")</scr' + 'ipt>'
</script>

<template>
  <XMarkdown class-name="x-markdown-light" :content="content" open-links-in-new-tab />
</template>
