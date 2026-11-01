<script setup lang="tsx">
defineOptions({ name: 'AXBubbleMarkdownV2' });

import { computed, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { Button, Flex, theme, Typography } from 'ant-design-vue';
import { isDarkColor } from '../_shared/playground-shell';

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const { token } = theme.useToken();
const markdownClass = computed(() => (
  isDarkColor(token.value.colorBgContainer) ? 'x-markdown-dark' : 'x-markdown-light'
));

const index = ref(text.length);
const isServer = import.meta.env.SSR;

watchEffect((onCleanup) => {
  if (!isServer && index.value < text.length) {
    const timerId = setTimeout(() => {
      index.value += 5;
    }, 20);
    onCleanup(() => clearTimeout(timerId));
  }
});

defineRender(() => (
  <Flex vertical gap={16}>
    <Flex>
      <Button type="primary" onClick={() => (index.value = 1)}>
        rerender
      </Button>
    </Flex>
    <Flex>
      <Bubble
        content={text.slice(0, index.value)}
        contentRender={(content) => (
          <Typography>
            <XMarkdown className={markdownClass.value} content={content as string} />
          </Typography>
        )}
      />
    </Flex>
  </Flex>
));
</script>
