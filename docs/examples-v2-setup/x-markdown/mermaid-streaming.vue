<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownMermaidStreamingV2Setup' });

import { h, onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import Mermaid from '@ant-design-x-vue/x-markdown/plugins/Mermaid';
import { codeRenderer } from '../../examples-v2/_shared/markdown-code';

const fullContent = `
Here are several Mermaid diagram examples

#### 1. Flowchart (Vertical)

\`\`\` mermaid
graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
\`\`\`
`;

const isClient = typeof window !== 'undefined';

const Code = codeRenderer((props: ComponentProps, lang, codeText) => {
  if (lang === 'mermaid') return h(Mermaid, { children: codeText });
  return h('code', { class: props.className }, codeText);
});

const index = ref(0);
const isServer = import.meta.env.SSR;
const components = { code: Code };

watchEffect((onCleanup) => {
  if (isServer || index.value >= fullContent.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(fullContent.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = fullContent.length;
});

const renderContent = (content: unknown) =>
  h(XMarkdown, {
    content: String(content ?? ''),
    components,
    paragraphTag: 'div',
  });

const restart = () => {
  index.value = 0;
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-button style="align-self: flex-end" @click="restart">Re-Render</a-button>
    <Bubble
      v-if="isClient"
      :content="fullContent.slice(0, index)"
      :content-render="renderContent"
      variant="outlined"
    />
    <pre v-else>{{ fullContent }}</pre>
  </a-flex>
</template>
