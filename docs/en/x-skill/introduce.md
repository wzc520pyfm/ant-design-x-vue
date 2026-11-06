# Using X Skill in Vue

[`@ant-design/x-skill`](https://www.npmjs.com/package/@ant-design/x-skill) is a **framework-agnostic** Agent Skill / CLI (`npx x-skill`). It gives Claude Code, Cursor, and similar IDEs guidance for Ant Design X. This Vue repo **does not ship a second CLI** — install the official package.

> 中文：[在 Vue 里使用 X Skill](/x-skill/introduce)

Skill files use React examples (`@ant-design/x`, `antd`, JSX). In an `ant-design-x-vue` project, remap names as below.

## Install

```bash
npm i -g @ant-design/x-skill
npx x-skill
```

You can also add it to the Claude Code plugin marketplace, or copy skill files into `~/.claude/skills`, the project `.claude/skills`, or `.cursor/skills`.

## Package name map

| Written in the skill (React) | Use this in Vue |
| --- | --- |
| `@ant-design/x` | `ant-design-x-vue` |
| `antd` / `antd@6` | `ant-design-vue` |
| `@ant-design/x-sdk` | `@ant-design-x-vue/x-sdk` |
| `@ant-design/x-markdown` | `@ant-design-x-vue/x-markdown` |
| `@ant-design/x-card` | `@ant-design-x-vue/x-card` |
| `className` / `style` JSX | `class` / `:style` in templates, or `h()` |
| `XProvider` + React `theme.zeroRuntime` | Not ported on the Vue side (see note below) |

## A minimal conversation

The skill's `use-x-chat` / Sender / Bubble examples look like this in Vue:

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest } = useXChat({
  // request / defaultMessages match the React shape
})
</script>

<template>
  <Bubble.List :items="messages" />
  <Sender @submit="onRequest" />
</template>
```

Stream Markdown with `XMarkdown` from `@ant-design-x-vue/x-markdown`, not React's `@ant-design/x-markdown`. Dynamic cards use `XCard.Box` / `XCard.Card` from `@ant-design-x-vue/x-card` (see [X Card](/en/x-card/introduce)).

## What the bundled skills cover

The official package currently includes:

- `use-x-chat`: conversation SDK
- `x-chat-provider`: request data flow
- `x-request`: request helpers
- `x-markdown`: streaming Markdown / plugins / themes
- plus related skill files such as x-card

These are **instructions for agents**, not runtime Vue components. After installing the skill, ask the agent to follow the table above.

## Why there is no `@ant-design-x-vue/x-skill`

React's `@ant-design/x-skill` is not a UI package. A second Vue CLI would only fork install commands and skill files. Revisit Vue-specific skill text if upstream skills start distinguishing frameworks, or if Vue-only component conventions appear.

`XProvider.theme.zeroRuntime` is skipped on Vue: `XProvider.theme` is `ant-design-vue`'s `ConfigProvider` theme, and there is no cssinjs extraction pipeline equivalent to React `@ant-design/cssinjs`.
