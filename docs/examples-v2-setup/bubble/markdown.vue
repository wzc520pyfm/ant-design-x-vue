<script setup lang="ts">
defineOptions({ name: 'AXBubbleMarkdownV2Setup' });

import { computed, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { theme } from 'ant-design-vue';
import { isDarkColor } from '../../examples-v2/_shared/playground-shell';

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

const rerender = () => {
  index.value = 1;
};
</script>

<template>
  <a-flex vertical :gap="16">
    <a-flex>
      <a-button type="primary" @click="rerender">rerender</a-button>
    </a-flex>
    <a-flex>
      <Bubble :content="text.slice(0, index)">
        <template #content="{ content }">
          <a-typography>
            <XMarkdown
              :class-name="markdownClass"
              :content="content"
            />
          </a-typography>
        </template>
      </Bubble>
    </a-flex>
  </a-flex>
</template>
