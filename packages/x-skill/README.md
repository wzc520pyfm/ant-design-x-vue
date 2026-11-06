# Vue X Skill

Agent skill texts for **ant-design-x-vue**. These files teach Cursor, Claude Code, and similar IDEs how to write Vue SFCs against this repo’s packages — not React JSX against `@ant-design/x`.

Package: `@ant-design-x-vue/x-skill@2.0.0`. The npm publish is deferred until the 2.0 line lands on `main` (see issue #536). Until then, run the CLI from this repository.

中文说明见 [README.zh-CN.md](./README.zh-CN.md).

## Install

```bash
# After publish
npm i -g @ant-design-x-vue/x-skill
npx @ant-design-x-vue/x-skill
# or, after a global install
x-skill-vue
```

From this monorepo (before publish):

```bash
node packages/x-skill/bin/cli.js
```

Common flags: `--cursor`, `--claude`, `--global`, `--lang zh|en`, `--force`, `--help`, `--version`.

The CLI copies `skills/` or `skills-zh/` into `.cursor/skills` and/or `.claude/skills`. It does not depend on figlet and does not install the React `@ant-design/x-skill` package.

### Manual copy

```bash
mkdir -p .cursor/skills
cp -R packages/x-skill/skills-zh/* .cursor/skills/   # or skills/* for English
```

User-level: `~/.cursor/skills/` or `~/.claude/skills/`.

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

English texts live in `skills/`. Chinese texts live in `skills-zh/`.

## Vue rules the skills insist on

- Import UI from `ant-design-x-vue`, SDK from `@ant-design-x-vue/x-sdk`, Markdown from `@ant-design-x-vue/x-markdown`, cards from `@ant-design-x-vue/x-card`.
- Examples use `<script setup lang="ts">` and templates (`class`, `:style`, `@submit`) — not React JSX or `className`.
- `useXChat().messages` is a `Ref`; map `msg.message` before passing to `Bubble.List`. Prefer the Vue `roles` prop (`role` also works; `roles` wins if both are set).
- Provider `XRequest` must use `manual: true`. One Provider instance per conversation.
- `XProvider` exists, but `theme.zeroRuntime` is not ported (no React cssinjs extraction pipeline).
- `XRequest(...)` returns an instance with `run()` / `abort()` — it is not itself an async function.

## Docs

Site pages: [Introduction](https://x-vue.ant.design/x-skill/introduce), [Prompt Templates](https://x-vue.ant.design/x-skill/prompt), and [Skills List](https://x-vue.ant.design/x-skill/skills). English counterparts live under `/en/x-skill/`.
