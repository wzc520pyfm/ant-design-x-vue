<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownThemesCustomV2Setup' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = `
# Custom theme sample

## Section title

Body text with a [link](https://x.ant.design).

- one
- two
- three
`;
</script>

<template>
  <div class="ax-xmd-custom-theme" style="padding: 16px">
    <XMarkdown class-name="x-markdown-light ax-xmd-custom" :content="content" />
  </div>
</template>

<style>
.ax-xmd-custom-theme .ax-xmd-custom h1 {
  color: #1677ff;
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.ax-xmd-custom-theme .ax-xmd-custom h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #1677ff, #69b1ff);
  border-radius: 2px;
}

.ax-xmd-custom-theme .ax-xmd-custom h2 {
  color: rgba(0, 0, 0, 0.88);
  font-size: 20px;
  margin: 24px 0 12px;
  padding-left: 12px;
  border-left: 4px solid #1677ff;
}

.ax-xmd-custom-theme .ax-xmd-custom p,
.ax-xmd-custom-theme .ax-xmd-custom li {
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.8;
}
</style>
