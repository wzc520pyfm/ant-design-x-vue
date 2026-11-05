<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownRendererV2Setup' });

import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = '# Render Code Text\n\n<html><form><button>Test</button><form></html>';

const DataRender = (props: ComponentProps) => String((props as any)['data-info'] ?? '');

const components = { data: DataRender };
const config = {
  renderer: {
    html(token: { text?: string }) {
      return `<data data-info="${token.text ?? ''}"></data>`;
    },
    heading({ tokens, depth }: { tokens: any[]; depth: number }) {
      const text = (this as any).parser.parseInline(tokens);
      return `<h${depth}>🚀 ${text}</h${depth}>`;
    },
  },
};
</script>

<template>
  <XMarkdown
    class-name="x-markdown-light"
    :content="content"
    :components="components"
    :config="config"
  />
</template>
