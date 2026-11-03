<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownHighlightStreamingV2' });

import { onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import { Button, Flex } from 'ant-design-vue';
import { codeRenderer } from '../_shared/markdown-code';

const text = `
Here's a Python code block example that demonstrates how to calculate Fibonacci numbers:

\`\`\` python
def fibonacci(n):
    """
    Calculate the nth Fibonacci number
    :param n: The position in the Fibonacci sequence (must be a positive integer)
    :return: The value at position n
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n+1):
            a, b = b, a + b
        return b

# Example usage
if __name__ == "__main__":
    num = 10
    print(f"The {num}th Fibonacci number is: {fibonacci(num)}")
\`\`\`

This code includes a Fibonacci helper, docstring, and a short main block.
`;

const Code = codeRenderer((props, lang, codeText) => {
  if (!props.block) return <code class={props.className}>{codeText}</code>;
  return <HighlightCode lang={lang} children={codeText} />;
});

const index = ref(0);
const isServer = import.meta.env.SSR;

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

defineRender(() => (
  <Flex vertical gap="small">
    <Button style={{ alignSelf: 'flex-end' }} onClick={() => (index.value = 0)}>
      Re-Render
    </Button>
    <Bubble
      content={text.slice(0, index.value)}
      contentRender={(content) => (
        <XMarkdown
          content={content as string}
          components={{ code: Code }}
          paragraphTag="div"
        />
      )}
      variant="outlined"
    />
  </Flex>
));
</script>
