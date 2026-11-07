# XMarkdown core

```vue
<script setup lang="ts">
import { XMarkdown } from '@ant-design-x-vue/x-markdown'
</script>
<template>
  <XMarkdown content="# Title" />
</template>
```

Use inside `Bubble.List` via a stable `contentRender` that returns `h(XMarkdown, { content, streaming })`.
