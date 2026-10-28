<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownMermaidV2Setup' });

import { h } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Mermaid from '@ant-design-x-vue/x-markdown/plugins/Mermaid';
import type { ComponentProps } from '@ant-design-x-vue/x-markdown';
import { codeRenderer } from '../_shared/markdown-code';

const isClient = typeof window !== 'undefined';
const content = ['```mermaid', 'graph TD', '  A[Start] --> B[Answer]', '```'].join('\n');

const Code = codeRenderer((props: ComponentProps, lang, text) => {
  if (lang === 'mermaid') return h(Mermaid, { children: text });
  return h('code', { class: props.className }, text);
});

const components = { code: Code };
</script>

<template>
  <XMarkdown v-if="isClient" :content="content" :components="components" />
  <pre v-else>{{ content }}</pre>
</template>
