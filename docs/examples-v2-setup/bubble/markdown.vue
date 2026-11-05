<script setup lang="ts">
defineOptions({ name: 'AXBubbleMarkdownV2Setup' });

import { ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { theme } from 'ant-design-vue';

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const { token } = theme.useToken();
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
          <a-typography
            class="ax-bubble-md"
            :style="{ '--ax-link': token.colorLink, '--ax-link-hover': token.colorLinkHover }"
          >
            <XMarkdown :content="content" />
          </a-typography>
        </template>
      </Bubble>
    </a-flex>
  </a-flex>
</template>

<style>
.vp-doc .example-showcase .ax-bubble-md a {
  color: var(--ax-link, #1677ff);
  font-weight: 400;
  text-decoration: none;
}

.vp-doc .example-showcase .ax-bubble-md a:hover,
.vp-doc .example-showcase .ax-bubble-md a:active {
  color: var(--ax-link-hover, var(--ax-link, #1677ff));
  text-decoration: none;
}

.vp-doc .example-showcase .ax-bubble-md a::before,
.vp-doc .example-showcase .ax-bubble-md a::after {
  content: none !important;
}

.vp-doc .example-showcase .ax-bubble-md p,
.vp-doc .example-showcase .ax-bubble-md blockquote > p {
  margin: 0;
  line-height: 1.5714285714;
  font-size: inherit;
  color: inherit;
}

.vp-doc .example-showcase .ax-bubble-md blockquote {
  margin: 1em 0;
  padding: 0 0 0 0.6em;
  border: 0;
  border-inline-start: 4px solid rgba(100, 100, 100, 0.2);
  background: transparent;
  color: inherit;
  opacity: 0.85;
}
</style>
