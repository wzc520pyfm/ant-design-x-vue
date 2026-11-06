---
name: x-markdown
version: 2.0.0
description: 使用 @ant-design-x-vue/x-markdown 做流式 Markdown 渲染、插件、主题和 Vue 组件映射。不要用 @ant-design/x-markdown。
---

# 技能定位

用 `@ant-design-x-vue/x-markdown` 正确、可预期地渲染 Markdown。它不管会话状态——字符串准备好之后再交给它。

# 最小示例

```vue
<script setup lang="ts">
import { XMarkdown } from '@ant-design-x-vue/x-markdown'
</script>
<template>
  <XMarkdown content="# Hello" />
</template>
```

# 流式

布尔值 `:streaming="isStreaming"` 即可：`true` 表示还在输出（等价 `hasNextChunk: true`，并打开 incremental / complete / typewriter）；`false` 表示结束并刷出终稿。

**最后一块 chunk 必须把流式标记设为 false**，否则未闭合语法的占位不会收尾。

# 扩展

`components` 映射必须稳定，不要每次渲染新建对象。官方插件：`Latex`、`HighlightCode`、`Mermaid`。

自定义组件会收到 `domNode`、`streamStatus`、`children`。需要完整语法时判断 `streamStatus === 'done'`。

原始 HTML 优先 `escapeRawHtml`；必须渲染时显式传入最小的 `dompurifyConfig`。

# 开发规则

- 从 `@ant-design-x-vue/x-markdown` 引入
- 稳定的 `components`
- Vue SFC，不要 JSX

# 参考

- [CORE.md](reference/CORE.md) / [STREAMING.md](reference/STREAMING.md) / [EXTENSIONS.md](reference/EXTENSIONS.md) / [API.md](reference/API.md)
- https://x-vue.ant.design/x-markdown/introduce
