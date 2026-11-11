<script setup lang="tsx">
defineOptions({ name: 'AXCodeHighlighterWithXMarkdown' });

import { CodeHighlighter, Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Button, Flex } from 'ant-design-vue';
import { ref, watchEffect } from 'vue';
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
`;

const Code = codeRenderer((props, lang, content) => {
  if (!props.block) return <code class={props.className}>{content}</code>;
  return <CodeHighlighter lang={lang}>{content}</CodeHighlighter>;
});

const index = ref(0);
const isServer = import.meta.env.SSR;
const contentRef = ref<HTMLDivElement>();

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

defineRender(() => (
  <Flex
    ref={contentRef as any}
    vertical
    gap="small"
    style={{ height: 600, overflow: 'auto' }}
  >
    <Flex justify="flex-end">
      <Button onClick={() => (index.value = 0)}>Re-Render</Button>
    </Flex>
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
