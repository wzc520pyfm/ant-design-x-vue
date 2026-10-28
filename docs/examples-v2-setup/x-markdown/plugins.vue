<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownPluginsV2Setup' });

import { ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const enabled = ref(true);
const content = 'Ship the TODO before Friday.';
const emphasizeTodo = {
  transform(source: string) {
    return source.replaceAll('TODO', '**TODO**');
  },
};
</script>

<template>
  <a-flex vertical :gap="12" align="flex-start">
    <a-flex align="center" :gap="8" style="align-self: flex-start">
      <a-switch v-model:checked="enabled" />
      <span>plugin</span>
    </a-flex>
    <XMarkdown :content="content" :plugins="enabled ? [emphasizeTodo] : []" />
  </a-flex>
</template>
