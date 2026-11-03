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
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b
\`\`\`

#### 2. Sequence Diagram

\`\`\` mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>Server: POST /api/data
    Server->>Database: INSERT record
    Database-->>Server: Success
    Server-->>Client: 201 Created
\`\`\`

#### 3. Quadrant Chart

\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
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
