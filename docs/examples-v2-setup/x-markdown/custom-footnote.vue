<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownCustomFootnoteV2Setup' });

import { h } from 'vue';
import { XMarkdown, type ComponentProps, type Token } from '@ant-design-x-vue/x-markdown';
import { Popover } from 'ant-design-vue';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const referenceList = [
  { url: 'https://x.ant.design', title: 'link1' },
  { url: 'https://x.ant.design', title: 'link2' },
  { url: 'https://x.ant.design', title: 'link3' },
];

const content = [
  'XMarkdown supports custom marked extensions.[^1]',
  '',
  'Map the generated tag with `components` for interaction.[^2]',
  '',
  'See the plugins page for Latex / Highlight / Mermaid.[^3]',
].join('\n');

const Footnote = (props: ComponentProps & { href?: string; title?: string }) =>
  h(
    Popover,
    { content: props.title, title: 'Footnote', trigger: 'hover' },
    {
      default: () =>
        h(
          'span',
          {
            class: 'markdown-cite',
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '16px',
              height: '16px',
              margin: '0 2px',
              padding: '0 4px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.08)',
              fontSize: '11px',
              cursor: 'pointer',
              verticalAlign: 'super',
            },
            onClick: () => props.href && window.open(props.href, '_blank'),
          },
          props.children as any,
        ),
    },
  );

const footNoteExtension = {
  name: 'footnote',
  level: 'inline' as const,
  tokenizer(src: string) {
    const match = src.match(/^\[\^(\d+)\]/);
    if (!match) return undefined;
    return {
      type: 'footnote',
      raw: match[0],
      text: match[1],
    };
  },
  renderer(token: Token) {
    const order = Number(token.text) - 1;
    const current = referenceList[order];
    if (!current) return '';
    return `<footnote href="${current.url}" title="${current.title}">${token.text}</footnote>`;
  },
};

const config = { extensions: [footNoteExtension] };
const components = { footnote: Footnote };
</script>

<template>
  <XMarkdown
    class-name="x-markdown-light"
    :content="content"
    :config="config"
    :components="components"
  />
</template>
