<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownStreamingSyntaxV2Setup' });

import { computed, h, ref } from 'vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';

const full = 'Read the [guide](https://x.ant.design) before you ship.';
const content = ref('Read the [guide](https://x.ant.des');
const open = ref(true);

const IncompleteLink = (props: ComponentProps) => {
  const raw = decodeURIComponent(String(props['data-raw'] || ''));
  return h('span', { style: { color: '#8c8c8c' } }, raw);
};

const streaming = computed(() => (
  open.value
    ? {
        hasNextChunk: true,
        enableAnimation: true,
        incompleteMarkdownComponentMap: { link: 'incomplete-link' },
      }
    : false
));

const components = { 'incomplete-link': IncompleteLink };

function finish() {
  open.value = false;
  content.value = full;
}
</script>

<template>
  <a-flex vertical :gap="12">
    <a-button @click="finish">Finish the link</a-button>
    <XMarkdown :content="content" :streaming="streaming" :components="components" />
  </a-flex>
</template>
