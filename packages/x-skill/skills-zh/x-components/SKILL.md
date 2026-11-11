---
name: x-components
version: 2.10.0
description: 使用 ant-design-x-vue 搭建 AI 对话 UI：Bubble、Sender、Conversations、Prompts、ThoughtChain、Actions、Welcome、Attachments、Sources、Suggestion、Think、FileCard、CodeHighlighter、Mermaid、Folder、XProvider、Notification。只写 Vue SFC。
---

# 技能定位

讲解 **`ant-design-x-vue`** 的 UI 组件（`@ant-design/x` 的 Vue 实现）。数据流看 `use-x-chat` / `x-chat-provider` / `x-request`，Markdown 看 `x-markdown`。

**不要**引入 `@ant-design/x`，**不要**输出 React JSX。使用 `<script setup lang="ts">` 和模板（`class`、`:style`、kebab-case 事件）。

# 安装

```bash
npm install ant-design-x-vue ant-design-vue
```

根节点用 `XProvider` 代替裸的 `ConfigProvider`。Vue 未移植 `theme.zeroRuntime`。

# RICH 分组

通用：`Bubble` / `Bubble.List` / `Conversations` / `Notification`  
唤醒：`Welcome` / `Prompts`  
表达：`Sender` / `Attachments` / `Suggestion`  
确认：`Think` / `ThoughtChain`  
反馈：`Actions` / `FileCard` / `Sources` / `CodeHighlighter` / `Mermaid` / `Folder`  
全局：`XProvider`

# 最小页面

```vue
<script setup lang="ts">
import { XProvider, Welcome, Prompts, Bubble, Sender } from 'ant-design-x-vue'

const prompts = [{ key: '1', label: '你能做什么？' }]
const items = [{ key: '1', content: 'Hello World', placement: 'end' as const }]
</script>

<template>
  <XProvider>
    <Welcome title="你好！" description="我能帮你做什么？" />
    <Prompts :items="prompts" @item-click="(info) => console.log(info.data.label)" />
    <Bubble.List :items="items" />
    <Sender @submit="(msg: string) => console.log(msg)" />
  </XProvider>
</template>
```

# 关键规则

- 列表用 `Bubble.List`，角色配置用 **`roles`**（`role` 是别名，同时传时 `roles` 优先）
- SDK 的 `messages` 必须先映射成 `{ key, role, content, loading }`
- `contentRender` 返回 `h(...)` 或字符串
- `Sender`：`@submit` 发送，`@change` 输入，`:loading` + `@cancel` 取消
- `streaming` 在最后一块要设回 `false`
- `roles` / `components` 对象保持稳定
- `Folder` 内置可拖拽分栏，没有从包入口单独导出 Splitter
- 气泡里的 Markdown / 图表走 `contentRender` + `XMarkdown` / `Mermaid` / `CodeHighlighter`

# 参考

- [COMPONENTS.md](reference/COMPONENTS.md)
- [PATTERNS.md](reference/PATTERNS.md)
- https://x-vue.ant.design/component/overview
