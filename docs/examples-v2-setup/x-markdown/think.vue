<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownThinkV2Setup' });

import { Think } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const content = '<think>Check the constraint, then answer.</think>\n\nThe answer is 42.';
const components = { think: Think };
</script>

<template>
  <XMarkdown :content="content" :components="components" />
</template>
