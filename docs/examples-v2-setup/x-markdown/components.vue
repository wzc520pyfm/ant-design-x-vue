<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownComponentsV2Setup' });

import { ref, h } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import type { ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Flex, Input } from 'ant-design-vue';

const CustomH1 = (props: ComponentProps) => {
  return h('h1', { style: { color: '#1890ff' }, ...props }, props.children);
};

const components = {
  h1: CustomH1,
};

const content = ref(`# Custom Blue Title

## Normal H2

Paragraph with **bold** and *italic*.
`);
</script>

<template>
  <a-flex vertical :gap="16">
    <a-input-text-area v-model:value="content" :rows="6" />
    <div class="x-markdown-demo-wrap">
      <XMarkdown :content="content" :components="components" />
    </div>
  </a-flex>
</template>

<style scoped>
.x-markdown-demo-wrap {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  min-height: 100px;
}
</style>
