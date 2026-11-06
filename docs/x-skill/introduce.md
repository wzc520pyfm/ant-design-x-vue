# 在 Vue 里使用 X Skill

本仓库提供 **Vue 专用** Agent Skill 文本，路径在 [`packages/x-skill`](https://github.com/wzc520pyfm/ant-design-x-vue/tree/dev/packages/x-skill)。正文按 `ant-design-x-vue`、`<script setup lang="ts">` 和模板编写，Agent 会按 Vue API 出码，而不是按 React 的 `@ant-design/x` + JSX。

这些文件是给 Cursor / Claude Code 等 IDE 读的说明，**不是**运行时组件。当前 **尚未** 发布 npm 包 `@ant-design-x-vue/x-skill`，也没有再做一份 `npx x-skill` CLI。

## 安装（主路径）

把 skill 目录拷到编辑器的 skills 路径。中文（推荐）用 `skills-zh/`，英文用 `skills/`。

### Cursor

```bash
# 在 ant-design-x-vue 仓库根目录
mkdir -p .cursor/skills
cp -R packages/x-skill/skills-zh/* .cursor/skills/
```

用户级：拷到 `~/.cursor/skills/`。

### Claude Code

```bash
mkdir -p .claude/skills
cp -R packages/x-skill/skills-zh/* .claude/skills/
# 或：cp -R packages/x-skill/skills-zh/* ~/.claude/skills/
```

每个 skill 是一个含 `SKILL.md`（以及可选 `reference/`）的文件夹。装好后让 Agent 使用这些 Vue skill。

## 自带技能

| Skill | 内容 |
| --- | --- |
| `use-x-chat` | `useXChat` / `useXConversations`，以及 `Bubble.List` 的消息映射 |
| `x-chat-provider` | 内置与自定义 `AbstractChatProvider` |
| `x-request` | `XRequest`（实例上的 `run` / `abort`，Provider 必须 `manual: true`） |
| `x-markdown` | `XMarkdown` 流式渲染、插件、组件映射 |
| `x-card` | A2UI 与 `XCard.Box` / `XCard.Card` |
| `x-components` | `Bubble`、`Sender`、`Folder` 等 UI 组件 |

## 一段最小对话

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest, isRequesting, abort } = useXChat({
  provider, // 见 x-chat-provider；XRequest 必须 manual: true
})

const bubbleRoles = {
  user: { placement: 'end' as const },
  assistant: { placement: 'start' as const },
}
</script>

<template>
  <Bubble.List
    :roles="bubbleRoles"
    :items="messages.map(({ id, message, status }) => ({
      key: id,
      role: message.role,
      content: message.content,
      loading: status === 'loading',
    }))"
  />
  <Sender :loading="isRequesting" @submit="(v: string) => onRequest({ query: v })" @cancel="abort" />
</template>
```

注意：

- `messages` 是 `Ref<MessageInfo[]>`，正文在 `msg.message` 上，**不能**原样传给 `Bubble.List`
- Vue 规范字段是 **`roles`**（`role` 仅为对齐 React；同时传入时 `roles` 优先）
- Markdown 用 `@ant-design-x-vue/x-markdown` 的 `XMarkdown`
- 动态卡片用 `@ant-design-x-vue/x-card` 的 `XCard.Box` / `XCard.Card`（见 [X Card](/x-card/introduce)）
- `XProvider` 存在，但没有 React 的 `theme.zeroRuntime`

更完整的约定写在 skill 正文里，也见仓库 [packages/x-skill/README.md](https://github.com/wzc520pyfm/ant-design-x-vue/blob/dev/packages/x-skill/README.md)。

## 备选：React 官方 CLI

[`@ant-design/x-skill`](https://www.npmjs.com/package/@ant-design/x-skill)（`npx x-skill`）仍然可用，但 skill 正文是 React 示例（`@ant-design/x`、`antd`、JSX）。**Vue 项目请不要把它当作主路径**——Agent 会继续吐 React 包名。只有在你明确要对照上游 React 规则时，才把它当备选，并自行改写成 Vue。
