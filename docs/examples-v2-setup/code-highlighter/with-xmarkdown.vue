<script setup lang="ts">
defineOptions({ name: 'AXCodeHighlighterWithXMarkdownSetup' });

import { CodeHighlighter, Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Button, Flex } from 'ant-design-vue';
import { h, ref, watchEffect } from 'vue';
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

if __name__ == "__main__":
    print(fibonacci(10))
\`\`\`
`;

const Code = codeRenderer((props, lang, content) => {
  if (!props.block) return h('code', { class: props.className }, content);
  return h(CodeHighlighter, { lang, children: content });
});

const index = ref(0);
const isServer = import.meta.env.SSR;
const contentRef = ref<HTMLElement>();

watchEffect((onCleanup) => {
  if (!isServer && index.value < text.length) {
    const timerId = setTimeout(() => {
      index.value = Math.min(index.value + 5, text.length);
    }, 20);
    onCleanup(() => clearTimeout(timerId));
  }
});

watchEffect(() => {
  const el = contentRef.value;
  if (!el || index.value <= 0 || index.value >= text.length) return;
  if (el.scrollHeight > el.clientHeight) {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }
});

function renderMarkdown(content: string) {
  return h(XMarkdown, {
    content,
    components: { code: Code },
    paragraphTag: 'div',
  });
}
</script>

<template>
  <Flex
    ref="contentRef"
    vertical
    gap="small"
    :style="{ height: '600px', overflow: 'auto' }"
  >
    <Flex justify="flex-end">
      <Button @click="index = 0">Re-Render</Button>
    </Flex>
    <Bubble
      :content="text.slice(0, index)"
      :content-render="renderMarkdown"
      variant="outlined"
    />
  </Flex>
</template>
