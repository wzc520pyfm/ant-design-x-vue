<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownHighlightStreamingV2Setup' });

import { h, onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import { codeRenderer } from '../../examples-v2/_shared/markdown-code';

const text = `
Here's a Python code block example that demonstrates how to calculate Fibonacci numbers:

\`\`\` python
def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n+1):
            a, b = b, a + b
        return b
\`\`\`
`;

const Code = codeRenderer((props: ComponentProps, lang, codeText) => {
  if (!props.block) return h('code', { class: props.className }, codeText);
  return h(HighlightCode, { lang, children: codeText });
});

const index = ref(0);
const isServer = import.meta.env.SSR;
const components = { code: Code };

watchEffect((onCleanup) => {
  if (isServer || index.value >= text.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(text.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = text.length;
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
      :content="text.slice(0, index)"
      :content-render="renderContent"
      variant="outlined"
    />
  </a-flex>
</template>
