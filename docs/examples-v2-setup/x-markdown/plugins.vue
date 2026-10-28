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
  <a-flex vertical :gap="12">
    <a-switch v-model:checked="enabled" checked-children="plugin" un-checked-children="plain" />
    <XMarkdown :content="content" :plugins="enabled ? [emphasizeTodo] : []" />
  </a-flex>
</template>
