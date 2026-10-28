<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownLatexV2Setup' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Latex from '@ant-design-x-vue/x-markdown/plugins/Latex';

const content = ['Pythagoras: $a^2 + b^2 = c^2$.', '', '$$', 'S = \\pi r^2', '$$'].join('\n');
const config = { extensions: Latex() };
</script>

<template>
  <XMarkdown :content="content" :config="config" />
</template>
