# Introduction

> 中文：[介绍](/x-skill/introduce)

`@ant-design-x-vue/x-skill` is an intelligent skill library for Ant Design X Vue. The texts teach Cursor, Claude Code, and similar IDEs to generate `<script setup>` + templates against `ant-design-x-vue` — not React JSX against `@ant-design/x`.

These files are **instructions for agents**, not runtime components.

## Use cases

- **New project setup**: Quickly scaffold an Ant Design X Vue app
- **Feature development**: Get best practices and code examples for component usage
- **Problem troubleshooting**: Diagnose and resolve common development issues
- **Performance optimization**: Get practical advice on performance tuning

## Core advantages

- **Intelligent development**: Code generation and suggestions based on Vue best practices
- **Efficiency**: Less repetitive work, faster project delivery
- **Quality**: Follow Ant Design X Vue conventions
- **Coverage**: Conversation UI, data requests, state management, and more

## Included skills

See the [Skills List](/en/x-skill/skills). Prompt examples live on [Prompt Templates](/en/x-skill/prompt).

## Quick start

### Method 1: One-click installation (recommended)

Works with mainstream AI IDEs such as Claude Code and Cursor. The package name is `@ant-design-x-vue/x-skill` (current version `2.10.0`, aligned with the other 2.x packages in this repo).

#### Basic installation

```bash
# Install the skill library globally
npm i -g @ant-design-x-vue/x-skill

# Copy skills into the current project's .cursor/skills and .claude/skills
npx @ant-design-x-vue/x-skill

# After a global install you can also run
x-skill-vue
```

#### Options

```bash
# Help
npx @ant-design-x-vue/x-skill --help

# Installer version
npx @ant-design-x-vue/x-skill --version

# Cursor only / Claude Code only
npx @ant-design-x-vue/x-skill --cursor
npx @ant-design-x-vue/x-skill --claude

# User-level install (~/.cursor/skills, ~/.claude/skills)
npx @ant-design-x-vue/x-skill --global

# Language (default: skills-zh when LANG starts with zh, otherwise skills)
npx @ant-design-x-vue/x-skill --lang zh
npx @ant-design-x-vue/x-skill --lang en

# Overwrite existing skill folders with the same name
npx @ant-design-x-vue/x-skill --force
```

The CLI copies folders from `skills/` or `skills-zh/` into the target directories. It does **not** install React `@ant-design/x-skill`, and it has no figlet banner or interactive version picker.

### Method 2: Manual installation

Use this when you want to customize the copy. Prefer `skills-zh/` for Chinese or `skills/` for English.

#### Cursor

```bash
mkdir -p .cursor/skills
cp -R node_modules/@ant-design-x-vue/x-skill/skills/* .cursor/skills/
```

User-level: copy into `~/.cursor/skills/`.

#### Claude Code

```bash
mkdir -p .claude/skills
cp -R node_modules/@ant-design-x-vue/x-skill/skills/* .claude/skills/
# or: ~/.claude/skills/
```

Each skill is a folder with `SKILL.md` and optional `reference/` files.

## A minimal conversation

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest, isRequesting, abort } = useXChat({
  provider, // see x-chat-provider; XRequest must use manual: true
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

Notes:

- `messages` is `Ref<MessageInfo[]>`; the payload is `msg.message`. Do **not** pass the ref value straight to `Bubble.List`.
- Vue’s canonical list prop is **`roles`** (`role` is a React-parity alias; `roles` wins if both are set).
- Stream Markdown with `XMarkdown` from `@ant-design-x-vue/x-markdown`.
- Dynamic cards use `XCard.Box` / `XCard.Card` from `@ant-design-x-vue/x-card` (see [X Card](/en/x-card/introduce)).
- `XProvider` exists, but `theme.zeroRuntime` is not ported.

See also [packages/x-skill/README.md](https://github.com/wzc520pyfm/ant-design-x-vue/blob/dev/packages/x-skill/README.md).

## Fallback: official React CLI

[`@ant-design/x-skill`](https://www.npmjs.com/package/@ant-design/x-skill) (`npx x-skill`) still installs React-oriented files (`@ant-design/x`, `antd`, JSX). **Do not treat it as the primary path in a Vue project** — the agent will keep emitting React packages. Use it only when you explicitly want to compare upstream React rules, then rewrite to Vue yourself.
