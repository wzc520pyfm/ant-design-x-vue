<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownOpenLinksV2Setup' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = `
### Open links in a new tab

- [Ant Design](https://ant.design)
- [GitHub](https://github.com)

### Reference link

This is a [reference-style link][1].

[1]: https://ant.design/components/overview
`;
</script>

<template>
  <a-flex vertical :gap="24">
    <div>
      <h4 style="margin-top: 0">openLinksInNewTab enabled</h4>
      <XMarkdown class-name="x-markdown-light" open-links-in-new-tab :content="content" />
    </div>
    <div>
      <h4 style="margin-top: 0">Default (same tab)</h4>
      <XMarkdown class-name="x-markdown-light" :content="content" />
    </div>
  </a-flex>
</template>
