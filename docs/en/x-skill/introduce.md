# Using X Skill in Vue

> 中文：[在 Vue 里使用 X Skill](/x-skill/introduce)

This repo ships **Vue-native** Agent skill texts in [`packages/x-skill`](https://github.com/wzc520pyfm/ant-design-x-vue/tree/dev/packages/x-skill). They teach Cursor, Claude Code, and similar IDEs to generate `<script setup>` + templates against `ant-design-x-vue` — not React JSX against `@ant-design/x`.

These files are **instructions for agents**, not runtime components. `@ant-design-x-vue/x-skill` is **not published** to npm, and this repo does not fork the `npx x-skill` CLI.

## Install (primary path)

Copy a locale into your editor’s skills directory. Use `skills-zh/` for Chinese or `skills/` for English.

### Cursor

```bash
mkdir -p .cursor/skills
cp -R packages/x-skill/skills/* .cursor/skills/
```

User-level: copy into `~/.cursor/skills/`.

### Claude Code

```bash
mkdir -p .claude/skills
cp -R packages/x-skill/skills/* .claude/skills/
# or: ~/.claude/skills/
```

Each skill is a folder with `SKILL.md` and optional `reference/` files.

## Bundled skills

| Skill | Covers |
| --- | --- |
| `use-x-chat` | `useXChat` / `useXConversations`, and mapping into `Bubble.List` |
| `x-chat-provider` | Built-in and custom `AbstractChatProvider` |
| `x-request` | `XRequest` (instance `run` / `abort`; Providers need `manual: true`) |
| `x-markdown` | `XMarkdown` streaming, plugins, component maps |
| `x-card` | A2UI with `XCard.Box` / `XCard.Card` |
| `x-components` | UI components such as `Bubble`, `Sender`, `Folder` |

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
