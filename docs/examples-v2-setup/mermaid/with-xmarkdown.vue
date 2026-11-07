<script setup lang="ts">
import { Bubble, Mermaid } from 'ant-design-x-vue';
import XMarkdown from '@ant-design-x-vue/x-markdown';
import { Button, Flex } from 'ant-design-vue';
import { computed, h, onBeforeUnmount, ref, watchEffect } from 'vue';

defineOptions({ name: 'AXMermaidWithXMarkdownV2Setup' });

const text = `
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

const index = ref(0);
let timer: ReturnType<typeof setTimeout> | null = null;

watchEffect((onCleanup) => {
  if (index.value >= text.length) return;
  timer = setTimeout(() => {
    index.value = Math.min(index.value + 5, text.length);
  }, 20);
  onCleanup(() => {
    if (timer) clearTimeout(timer);
  });
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

const content = computed(() => text.slice(0, index.value));

function Code(props: { className?: string; class?: string; children?: unknown }) {
  const cls = props.className || props.class || '';
  const lang = cls.match(/language-(\w+)/)?.[1] || '';
  if (typeof props.children !== 'string') return null;
  if (lang === 'mermaid') {
    return h(Mermaid, { children: props.children });
  }
  return h('code', null, props.children as string);
}

function contentRender(c: string) {
  return h(
    XMarkdown,
    { components: { code: Code }, paragraphTag: 'div' },
    () => c,
  );
}
</script>

<template>
  <Flex vertical gap="small" style="height: 600px; overflow: auto">
    <Flex justify="flex-end">
      <Button @click="index = 0">Re-Render</Button>
    </Flex>
    <Bubble
      :content="content"
      :styles="{ content: { width: 700 } }"
      :content-render="contentRender"
      variant="outlined"
    />
  </Flex>
</template>
