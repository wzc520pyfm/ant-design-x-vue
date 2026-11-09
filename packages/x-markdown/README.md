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

Pass a boolean for the 2.10 preset (`incremental` + `incompleteMarkdown: 'complete'` + `typewriter`), or an object for per-option control (`tail`, `enableAnimation`, …):

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const content = ref('');
const isStreaming = ref(true);

const simulateStream = async () => {
  const text = 'Hello, this is streaming markdown content...';
  for (const char of text) {
    content.value += char;
    await new Promise((r) => setTimeout(r, 50));
  }
  isStreaming.value = false;
};
</script>

<template>
  <XMarkdown :content="content" :streaming="isStreaming" />
</template>
```

### With Plugins

```vue
<script setup lang="ts">
import {
  HighlightCode,
  Latex,
  Mermaid,
  XMarkdown,
} from '@ant-design-x-vue/x-markdown';

const components = {
  code: HighlightCode,
  mermaid: Mermaid,
};
const config = { extensions: Latex() };
</script>

<template>
  <XMarkdown
    :content="content"
    :components="components"
    :config="config"
  />
</template>
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
