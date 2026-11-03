<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownTokenizerV2Setup' });

import { XMarkdown, type Token } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = `% Level 1 Heading\n %% Level 2 Heading \n %%% Level 3 Heading\n %%%% Level 4 Heading`;

interface PercentHeadingToken extends Token {
  type: 'percentHeading';
  depth: number;
  text: string;
}

const percentHeading = {
  name: 'percentHeading',
  level: 'block' as const,
  start(src: string): number {
    return src.indexOf('%');
  },
  tokenizer(src: string): PercentHeadingToken | undefined {
    const rule = /^%+([^\n]+)(?:\n|$)/;
    const match = rule.exec(src);
    if (!match) return undefined;
    const depth = match[0].match(/^%+/)?.[0].length || 0;
    return {
      type: 'percentHeading',
      raw: match[0],
      depth: Math.min(depth, 6),
      text: match[1].trim(),
      tokens: [],
    };
  },
  renderer(token: PercentHeadingToken): string {
    return `<h${token.depth}>${token.text}</h${token.depth}>\n`;
  },
};

const config = { extensions: [percentHeading] };
</script>

<template>
  <XMarkdown class-name="x-markdown-light" :content="content" :config="config" />
</template>
