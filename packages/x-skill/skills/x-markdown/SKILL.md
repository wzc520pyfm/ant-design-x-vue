---
name: x-markdown
version: 2.0.0
description: Render streaming Markdown with @ant-design-x-vue/x-markdown — XMarkdown, plugins, themes, and Vue component maps. Not @ant-design/x-markdown.
---

# Skill Positioning

Render Markdown correctly with `@ant-design-x-vue/x-markdown`. It is not a chat-state tool — use it after `useXChat` (or your own state) already has the string.

# Package boundaries

| Layer | Package |
| --- | --- |
| UI | `ant-design-x-vue` |
| Data | `@ant-design-x-vue/x-sdk` |
| Render | `@ant-design-x-vue/x-markdown` |

# Minimal setup

```vue
<script setup lang="ts">
import { XMarkdown } from '@ant-design-x-vue/x-markdown'
</script>

<template>
  <XMarkdown content="# Hello" />
</template>
```

`children` is an alias of `content`. Root class: `class` / `className` / `rootClassName` (Vue prefers `class` in templates; the prop also accepts `className`).

# Streaming

Pass a boolean (`:streaming="isStreaming"`) or an object.

Boolean `true` means “still streaming”: `hasNextChunk: true` plus `incremental`, `incompleteMarkdown: 'complete'`, and `typewriter`. `false` flushes the final document.

Object fields (see docs for defaults): `hasNextChunk`, `incremental`, `incompleteMarkdown` (`placeholder` | `complete`), `incompleteMarkdownComponentMap`, `typewriter`, `enableAnimation`, `animationConfig`, `tail`.

**Always set `hasNextChunk` / boolean streaming to `false` on the last chunk**, otherwise incomplete placeholders will not flush.

```vue
<template>
  <XMarkdown :content="text" :streaming="isStreaming" />
</template>
```

If a custom component needs complete syntax, branch on `streamStatus === 'done'`.

# Extensions

Keep the `components` map **stable** (module-level or a `const` in setup). Do not allocate a new object each render.

```vue
<script setup lang="ts">
import { XMarkdown, Latex, HighlightCode, Mermaid } from '@ant-design-x-vue/x-markdown'
import ThinkBlock from './ThinkBlock.vue'

const mdComponents = {
  think: ThinkBlock,
}

const plugins = [Latex, HighlightCode, Mermaid]
</script>

<template>
  <XMarkdown
    :content="text"
    :components="mdComponents"
    :plugins="plugins"
    :streaming="isStreaming"
  />
</template>
```

Custom components receive `domNode`, `streamStatus`, `children`, etc.

Safety: prefer `escapeRawHtml` when raw HTML should stay visible as text. If you must render HTML, pass an explicit minimal `dompurifyConfig`.

Themes: start from `x-markdown-light` / `x-markdown-dark` and override CSS variables only. See https://x-vue.ant.design/x-markdown/themes

# Development rules

- Import `@ant-design-x-vue/x-markdown`, never `@ant-design/x-markdown`
- Stable `components` object
- Final chunk must end the streaming flag
- Vue SFC / `h()`, not JSX

# Reference

- [CORE.md](reference/CORE.md)
- [STREAMING.md](reference/STREAMING.md)
- [EXTENSIONS.md](reference/EXTENSIONS.md)
- [API.md](reference/API.md)
- https://x-vue.ant.design/x-markdown/introduce
