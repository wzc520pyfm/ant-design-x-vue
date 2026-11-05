<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownLatexStreamingV2' });

import { onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Latex from '@ant-design-x-vue/x-markdown/plugins/Latex';
import { Button, Flex } from 'ant-design-vue';

const fullContent = `
### Latex

inline standard: $\\frac{df}{dt}$

block standard:

$$
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
$$

inline: \\(\\frac{df}{dt}\\)

block:

\\[
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
\\]
`;

const index = ref(0);
const isServer = import.meta.env.SSR;

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

defineRender(() => (
  <Flex vertical gap="small">
    <Button style={{ alignSelf: 'flex-end' }} onClick={() => (index.value = 0)}>
      Re-Render
    </Button>
    <Bubble
      content={fullContent.slice(0, index.value)}
      contentRender={(content) => (
        <XMarkdown
          content={content as string}
          config={{ extensions: Latex() }}
          paragraphTag="div"
        />
      )}
      variant="outlined"
    />
  </Flex>
));
</script>
