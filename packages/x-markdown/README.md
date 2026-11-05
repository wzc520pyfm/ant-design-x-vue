# @ant-design-x-vue/x-markdown

Markdown rendering component for ant-design-x-vue with streaming support.

## Features

- **XMarkdown** - Vue component for rendering markdown content
- **AnimationText** - Animated text display component
- **Streaming Support** - Built-in support for streaming content
- **Plugins** - Extensible plugin system for code highlighting, LaTeX, Mermaid diagrams

## Installation

```bash
pnpm add @ant-design-x-vue/x-markdown
```

## Usage

```vue
<script setup lang="ts">
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const content = `# Hello World

This is a **markdown** example.

\`\`\`javascript
console.log('Hello');
\`\`\`
`;
</script>

<template>
  <XMarkdown :content="content" />
</template>
```

### With Streaming

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { XMarkdown, useStreaming } from '@ant-design-x-vue/x-markdown';

const content = ref('');
const streaming = ref(true);

// Simulated streaming content
const simulateStream = async () => {
  const text = 'Hello, this is streaming markdown content...';
  for (const char of text) {
    content.value += char;
    await new Promise((r) => setTimeout(r, 50));
  }
  streaming.value = false;
};
</script>

<template>
  <XMarkdown :content="content" :streaming="streaming" />
</template>
```

### With Plugins

```typescript
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createHighlightCodePlugin } from '@ant-design-x-vue/x-markdown/plugins/highlight-code';
import { createLatexPlugin } from '@ant-design-x-vue/x-markdown/plugins/latex';
import { createMermaidPlugin } from '@ant-design-x-vue/x-markdown/plugins/mermaid';

const plugins = [
  createHighlightCodePlugin({ theme: 'dark' }),
  createLatexPlugin(),
  createMermaidPlugin(),
];
```

## Themes

Import pre-built themes:

```typescript
import '@ant-design-x-vue/x-markdown/themes/light.css';
// or
import '@ant-design-x-vue/x-markdown/themes/dark.css';
```

## License

MIT
