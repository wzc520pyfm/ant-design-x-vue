---
name: x-components
version: 2.0.0
description: Build AI chat UIs with ant-design-x-vue — Bubble, Sender, Conversations, Prompts, ThoughtChain, Actions, Welcome, Attachments, Sources, Suggestion, Think, FileCard, CodeHighlighter, Mermaid, Folder, XProvider, Notification. Vue SFCs only.
---

# Skill Positioning

UI components in **`ant-design-x-vue`** (Vue port of `@ant-design/x`). For data flow use `use-x-chat` / `x-chat-provider` / `x-request`. For Markdown rendering use `x-markdown`.

Do **not** import `@ant-design/x`. Do **not** emit React JSX. Use `<script setup lang="ts">` and templates (`class`, `:style`, kebab-case listeners).

# Packages

```bash
npm install ant-design-x-vue ant-design-vue
```

`XProvider` wraps `ant-design-vue`’s `ConfigProvider` and adds X locale / shortcuts. Prefer `XProvider` at the app root instead of a bare `ConfigProvider`.

**Not ported:** `XProvider.theme.zeroRuntime` (no React `@ant-design/cssinjs` extraction pipeline). `XProvider.theme` is the ant-design-vue theme object only.

# Component groups (RICH)

| Stage | Components |
| --- | --- |
| General | `Bubble`, `Bubble.List`, `Conversations`, `Notification` |
| Wake | `Welcome`, `Prompts` |
| Express | `Sender`, `Attachments`, `Suggestion` |
| Confirmation | `Think`, `ThoughtChain` |
| Feedback | `Actions`, `FileCard`, `Sources`, `CodeHighlighter`, `Mermaid`, `Folder` |
| Global | `XProvider` |

# Minimal page

```vue
<script setup lang="ts">
import { XProvider, Welcome, Prompts, Bubble, Sender } from 'ant-design-x-vue'

const prompts = [{ key: '1', label: 'What can you do?' }]
const items = [{ key: '1', content: 'Hello World', placement: 'end' as const }]

function onPromptClick(info: { data: { label?: string } }) {
  console.log(info.data.label)
}
</script>

<template>
  <XProvider>
    <Welcome title="Hello!" description="How can I help you?" />
    <Prompts :items="prompts" @item-click="onPromptClick" />
    <Bubble.List :items="items" />
    <Sender @submit="(msg: string) => console.log(msg)" />
  </XProvider>
</template>
```

# Decision guide

| Need | Notes |
| --- | --- |
| Message list | `Bubble.List` + stable `roles` (alias `role`; `roles` wins). Map SDK `messages` first — see `use-x-chat`. |
| Input | `Sender` — `@submit` to send, `@change` on each keystroke, `@cancel` while loading |
| Conversation switcher | `Conversations` — `:items`, `:active-key`, `@active-change` |
| Reasoning | `ThoughtChain` for multi-step tool/agent traces; `Think` for one collapsible block (e.g. DeepSeek `reasoning_content`) |
| Message toolbar | Prefer `Actions.Copy`, `Actions.Feedback`, `Actions.Audio` |
| Welcome / onboarding | `Welcome` + `Prompts` |
| Files in the composer | `Attachments` slotted into `Sender` |
| Citations | `Sources` |
| Slash commands | `Suggestion` |
| File tree | `Folder` (includes an internal Splitter for tree/preview widths; not a separate package export) |
| Markdown / diagrams inside a bubble | `contentRender` + `XMarkdown` / `Mermaid` / `CodeHighlighter` — never dump those as raw `content` strings |

# Development rules

- Wrap the app with `XProvider`
- Use `Bubble.List` in lists (scroll anchoring, role layout). Do not hand-loop `Bubble` unless you need a one-off.
- Keep `roles` / `components` objects stable so typing animations do not reset
- Set `streaming` true while chunks arrive and **false** on the last chunk
- `contentRender` returns a VNode (`h(...)`) or string — not JSX
- Prefer Vue `roles` over React-only advice that says “use `role`, not `roles`”
- `class` not `className`; semantic maps use `classNames` / `styles` as in the Vue docs
- Folder preview still defaults to `<pre><code>` unless you pass a preview slot/render

# Collaboration

| Scenario | Skills |
| --- | --- |
| Full chat app | `x-chat-provider` → `x-request` → `use-x-chat` → `x-components` → `x-markdown` |
| UI structure only | `x-components` |
| Cards beside chat | `x-components` + `x-card` |

# Reference

- [COMPONENTS.md](reference/COMPONENTS.md)
- [PATTERNS.md](reference/PATTERNS.md)
- Site: https://x-vue.ant.design/component/overview
