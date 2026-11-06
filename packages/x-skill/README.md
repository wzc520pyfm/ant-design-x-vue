# Vue X Skill

Agent skill texts for **ant-design-x-vue**. These files teach Cursor, Claude Code, and similar IDEs how to write Vue SFCs against this repo’s packages — not React JSX against `@ant-design/x`.

This folder is **skill content only**. It is **not** published to npm as `@ant-design-x-vue/x-skill`. There is no CLI fork of `npx x-skill` here.

中文说明见 [README.zh-CN.md](./README.zh-CN.md)。

## Packages the skills teach

| Layer | Package |
| --- | --- |
| UI | `ant-design-x-vue` (+ `ant-design-vue`) |
| SDK | `@ant-design-x-vue/x-sdk` |
| Markdown | `@ant-design-x-vue/x-markdown` |
| Cards | `@ant-design-x-vue/x-card` |

## Bundled skills

| Skill | What it covers |
| --- | --- |
| `use-x-chat` | `useXChat` / `useXConversations`, message mapping for `Bubble.List` |
| `x-chat-provider` | Built-in and custom `AbstractChatProvider` |
| `x-request` | `XRequest` transport, `manual: true`, security |
| `x-markdown` | `XMarkdown` streaming, plugins, component maps |
| `x-card` | A2UI v0.9 / v0.8, `XCard.Box` / `XCard.Card` |
| `x-components` | Vue UI components (`Bubble`, `Sender`, `Folder`, …) |

English texts live in `skills/`. Chinese texts live in `skills-zh/` (preferred for agents working in this repo).

## Install into an editor

Copy one locale of the skill folders (not this README) into the editor’s skill directory.

### Cursor

Project-level:

```bash
mkdir -p .cursor/skills
cp -R packages/x-skill/skills-zh/* .cursor/skills/   # or skills/* for English
```

User-level: copy into `~/.cursor/skills/` the same way.

### Claude Code

```bash
mkdir -p .claude/skills
cp -R packages/x-skill/skills-zh/* .claude/skills/
# or: cp -R packages/x-skill/skills-zh/* ~/.claude/skills/
```

Each skill is a folder that contains `SKILL.md` (and optional `reference/`). After copying, ask the agent to follow the Vue skills rather than React `@ant-design/x-skill`.

### Fallback

The upstream React CLI (`npx x-skill` / `@ant-design/x-skill`) still installs React-oriented skill files (`@ant-design/x`, JSX). Do not use those as the primary path in a Vue project.

## Vue rules the skills insist on

- Import UI from `ant-design-x-vue`, SDK from `@ant-design-x-vue/x-sdk`, Markdown from `@ant-design-x-vue/x-markdown`, cards from `@ant-design-x-vue/x-card`.
- Examples use `<script setup lang="ts">` and templates (`class`, `:style`, `@submit`) — not React JSX or `className`.
- `useXChat().messages` is a `Ref`; map `msg.message` before passing to `Bubble.List`. Prefer the Vue `roles` prop (`role` also works; `roles` wins if both are set).
- Provider `XRequest` must use `manual: true`. One Provider instance per conversation.
- `XProvider` exists, but `theme.zeroRuntime` is not ported (no React cssinjs extraction pipeline).
- `XRequest(...)` returns an instance with `run()` / `abort()` — it is not itself an async function.

## Docs

Site pages: [Using X Skill in Vue](https://x-vue.ant.design/x-skill/introduce) and the English counterpart under `/en/x-skill/introduce`.
