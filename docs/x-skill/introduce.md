# 介绍

`@ant-design-x-vue/x-skill` 是专为 Ant Design X Vue 打造的智能技能库。正文按 `ant-design-x-vue`、`<script setup lang="ts">` 和模板编写，能显著提升开发效率，帮助 Agent 按 Vue API 出码，而不是按 React 的 `@ant-design/x` + JSX。

这些文件是给 Cursor / Claude Code 等 IDE 读的说明，**不是**运行时组件。

## 适用场景

- **新项目启动**：快速搭建 Ant Design X Vue 项目框架
- **功能开发**：获取组件使用最佳实践和代码示例
- **问题排查**：智能诊断和解决常见开发问题
- **性能优化**：获取性能调优的专业建议

## 核心优势

- **智能化开发**：基于最佳实践的代码生成和优化建议
- **效率提升**：减少重复性工作，加速项目开发
- **质量保证**：遵循 Ant Design X Vue 约定，确保代码质量
- **场景丰富**：覆盖对话组件、数据请求、状态管理等常见场景

## 包含的技能

请查看 [技能列表](/x-skill/skills)。Prompt 示例见 [Prompt 模板](/x-skill/prompt)。

## 快速开始

### 方式一：一键安装（推荐）

支持 Claude Code、Cursor 等主流 AI IDE。包名为 `@ant-design-x-vue/x-skill`（版本 `2.0.0`，与仓库内其他 2.x 包对齐）。**npm 发布会随 [#536](https://github.com/wzc520pyfm/ant-design-x-vue/issues/536) 合入 `main` 之后进行**；发布前可在本仓库直接运行 CLI。

#### 基础安装

```bash
# 全局安装技能库（发布后）
npm i -g @ant-design-x-vue/x-skill

# 安装到当前项目的 .cursor/skills 与 .claude/skills
npx @ant-design-x-vue/x-skill

# 全局安装后也可以直接调用
x-skill-vue
```

发布前，在仓库根目录：

```bash
node packages/x-skill/bin/cli.js
# 或
pnpm --filter @ant-design-x-vue/x-skill exec x-skill-vue
```

#### 常用选项

```bash
# 查看帮助
npx @ant-design-x-vue/x-skill --help

# 查看安装器版本
npx @ant-design-x-vue/x-skill --version

# 只安装到 Cursor / 只安装到 Claude Code
npx @ant-design-x-vue/x-skill --cursor
npx @ant-design-x-vue/x-skill --claude

# 安装到用户目录（~/.cursor/skills、~/.claude/skills）
npx @ant-design-x-vue/x-skill --global

# 选择语言（默认：系统 LANG 以 zh 开头则用 skills-zh，否则用 skills）
npx @ant-design-x-vue/x-skill --lang zh
npx @ant-design-x-vue/x-skill --lang en

# 覆盖已存在的同名 skill 目录
npx @ant-design-x-vue/x-skill --force
```

CLI 会把 `skills/` 或 `skills-zh/` 下的技能文件夹复制到目标目录，**不会**去装 React 的 `@ant-design/x-skill`，也没有 figlet / 交互式版本选择。

### 方式二：手动安装

适用于需要定制化配置的场景。中文（推荐）用 `skills-zh/`，英文用 `skills/`。

#### Cursor

```bash
# 在 ant-design-x-vue 仓库根目录，或先 npm pack / 解压包
mkdir -p .cursor/skills
cp -R packages/x-skill/skills-zh/* .cursor/skills/
```

用户级：拷到 `~/.cursor/skills/`。

#### Claude Code

```bash
mkdir -p .claude/skills
cp -R packages/x-skill/skills-zh/* .claude/skills/
# 或：cp -R packages/x-skill/skills-zh/* ~/.claude/skills/
```

每个 skill 是一个含 `SKILL.md`（以及可选 `reference/`）的文件夹。装好后让 Agent 使用这些 Vue skill。

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
