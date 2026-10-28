<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownHighlightV2Setup' });

import { h } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import type { ComponentProps } from '@ant-design-x-vue/x-markdown';
import { codeRenderer } from '../_shared/markdown-code';

const content = [
  'A fenced block picks up the language class:',
  '',
  '```ts',
  'export const answer = 42;',
  '```',
].join('\n');

const Code = codeRenderer((props: ComponentProps, lang, text) => {
  if (!props.block) return h('code', { class: props.className }, text);
  return h(HighlightCode, { lang, children: text });
});

const components = { code: Code };
</script>

<template>
  <XMarkdown :content="content" :components="components" />
</template>
