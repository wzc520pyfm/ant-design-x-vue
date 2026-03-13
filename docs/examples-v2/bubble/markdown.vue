<script setup lang="tsx">
defineOptions({ name: 'AXBubbleMarkdownV2' });

import { ref, watchEffect } from 'vue';
import { Bubble, type BubbleProps } from 'ant-design-x-vue';
import { Button, Flex, Typography } from 'ant-design-vue';

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown: BubbleProps['contentRender'] = (content) => {
  // 简单的 markdown 渲染示例
  const html = (content as string)
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br />');
  return (
    <Typography>
      <div innerHTML={html} />
    </Typography>
  );
};

const index = ref(text.length);

watchEffect((onCleanup) => {
  if (index.value < text.length) {
    const timerId = setTimeout(() => {
      index.value += 5;
    }, 20);
    onCleanup(() => clearTimeout(timerId));
  }
});

defineRender(() => (
  <Flex vertical style={{ height: '150px' }} gap={16}>
    <Flex>
      <Button type="primary" onClick={() => (index.value = 1)}>
        rerender
      </Button>
    </Flex>
    <Flex>
      <Bubble content={text.slice(0, index.value)} contentRender={renderMarkdown} />
    </Flex>
  </Flex>
));
</script>
