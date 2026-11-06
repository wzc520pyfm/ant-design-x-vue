# 在 Vue 里使用 X Skill

[`@ant-design/x-skill`](https://www.npmjs.com/package/@ant-design/x-skill) 是一套 **框架无关** 的 Agent Skill / CLI（`npx x-skill`），给 Claude Code、Cursor 等 IDE 提供 Ant Design X 的开发指引。Vue 仓库 **不会再移植一份 CLI**——直接安装官方包即可。

技能正文按 React 写法举例（`@ant-design/x`、`antd`、JSX）。用在 `ant-design-x-vue` 项目里时，按下面的对照替换即可。

## 安装

```bash
npm i -g @ant-design/x-skill
npx x-skill
```

也可以按官方 README 把它加到 Claude Code 插件市场，或把 skill 文件拷到 `~/.claude/skills` / 项目 `.claude/skills`、`.cursor/skills`。

## 包名对照

| 技能里写的（React） | Vue 项目请改成 |
| --- | --- |
| `@ant-design/x` | `ant-design-x-vue` |
| `antd` / `antd@6` | `ant-design-vue` |
| `@ant-design/x-sdk` | `@ant-design-x-vue/x-sdk` |
| `@ant-design/x-markdown` | `@ant-design-x-vue/x-markdown` |
| `@ant-design/x-card` | `@ant-design-x-vue/x-card` |
| `className` / `style` JSX | `class` / `:style` 模板或 `h()` |
| `XProvider theme={{ zeroRuntime: true }}` | 见下方说明：Vue 侧当前不移植该开关 |

## 一段最小对话

技能里的 `use-x-chat` / Sender / Bubble 例子，对应到 Vue 大致是：

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest } = useXChat({
  // 与 React 对齐的 request / defaultMessages 写法
})
</script>

<template>
  <Bubble.List :items="messages" />
  <Sender @submit="onRequest" />
</template>
```

Markdown 流式渲染用 `@ant-design-x-vue/x-markdown` 的 `XMarkdown`，不要再用 React 的 `@ant-design/x-markdown`。动态卡片用 `@ant-design-x-vue/x-card` 的 `XCard.Box` / `XCard.Card`（见 [X Card](/x-card/introduce)）。

## 自带技能覆盖什么

官方包目前主要包括：

- `use-x-chat`：会话 SDK
- `x-chat-provider`：请求数据流
- `x-request`：请求封装
- `x-markdown`：流式 Markdown / 插件 / 主题
- 以及 x-card 等相关 skill 文件

这些都是 **给 Agent 读的说明**，不是运行时 Vue 组件。装好 skill 后，在本仓库里让 Agent 按上表替换包名即可。

## 为什么没有 `@ant-design-x-vue/x-skill`

React 的 `@ant-design/x-skill` 本身不是 UI 包。再维护一份 Vue CLI 只会分叉安装命令和 skill 文件。等上游 skill 开始区分框架、或 Vue 出现独有组件约定时，再考虑补充 Vue 专用 skill 文本。
