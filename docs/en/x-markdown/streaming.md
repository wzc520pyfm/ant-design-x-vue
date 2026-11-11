# XMarkdown streaming syntax

Streaming syntax processing LLM streaming returned Markdown: syntax completion and caching, incremental segmentation, typewriter, fade-in animation, and tail tags. Alignment React `@ant-design/x-markdown@2.10`.

## Examples

:::demo-v2 No streaming on the left; `streaming={isStreaming}` on the right. A boolean preset enables `incremental`, `incompleteMarkdown: 'complete'`, and `typewriter` (without tail).

x-markdown/streaming-preset

:::

:::demo-v2 Switch Mixed / Link / Image / Html / Table / Emphasis / InlineCode above. The left side types the source; the right side renders it. Incomplete links show a 16px placeholder instead of raw `[text](url`. Re-Render / Run Stream types from the start with fade-in.

x-markdown/streaming-syntax

:::

:::demo-v2 You can also pass boolean `streaming` and watch fade-in with typewriter output.

x-markdown/animation

:::

## API

### streaming

`streaming` accepts boolean values ​​or objects. Passing a Boolean value is the default: `true` means that streaming is in progress, which is equivalent to `hasNextChunk: true` and turning on `incremental`, `incompleteMarkdown: 'complete'`, and `typewriter`; `false` means that the stream has ended and the final content will be rendered. Just pass the existing `isStreaming` in the application directly: `<XMarkdown :content="content" :streaming="isStreaming" />`. Passing objects is controlled item by item.

| Argument | Description | Type | Default |
| --- | --- | --- | --- |
| **hasNextChunk** | Is there any data behind? Refresh the cache and complete rendering when `false` | `boolean` | `false` |
| **incremental** | Cut into segments by title, and each chunk only re-parses and renders the last segment that is growing. The passed object can set `minSectionChars` (sections shorter than this length are merged into the next section) and `keepSectionsOnEnd` (default `true`: each section remains unchanged after the end of the stream; `false`: when the stream ends, the whole article returns to one-time rendering) | `boolean \| { minSectionChars?: number; keepSectionsOnEnd?: boolean }` | `false` |
| **incompleteMarkdown** | How to display unfinished grammar: `placeholder` holds or displays the placeholder component; `complete` displays the half-written emphasis, inline code, link text, and list items as complete text immediately | `'placeholder' \| 'complete'` | `'placeholder'` |
| **incompleteMarkdownComponentMap** | Component mapping of incomplete grammar; after explicit configuration of a certain grammar, the placeholder component shall prevail | `Partial\<Record\<Exclude\<StreamCacheTokenType, 'text'\>, string\>\>` | `{}` |
| **typewriter** | Typewriter effect: Newly arrived content is released at a constant speed according to chunk rhythm, rather than appearing in whole blocks | `boolean \| TypewriterConfig` | `false` |
| **enableAnimation** | Enable text fade-in animation | `boolean` | `false` |
| **animationConfig** | Text animation configuration | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| **tail** | Whether to enable tail indicators; 'true' uses the default '▋', object transfer can be customized | `boolean \| TailConfig` | `false` |

> 'incremental' is only split before the top-level ATX title; Fenced code, HTML blocks, and '#' lines in the '$$' formula are not counted as titles. If a link reference definition, footnote definition, or custom component tag crosses the cutoff point in the document, do not split.

### TypewriterConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| unit | Release units. 'char' Word by word; 'sentence' Collect separators and release them together | `'char' \| 'sentence'` | `'char'` |
| delimiters | Sentence Separator | `string[]` | `['。 ', '！ ', '？ ', '.', '!', '?', '\n']` |
| minCps | Minimum speed (words/second) | `number` | `24` |
| maxCps | Top speed (words/second) | `number` | `3000` |
| pauseMs | Pause after playing the separator when 'unit' is 'char' (in milliseconds) | `number` | `0` |
| maxSentenceChars | 'unit' is the longest word count for 'sentence'; if exceeded, it is reverted and displayed word by word | `number` | `120` |

### TailConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Contents displayed at the end | `string` | `'▋'` |
| component | Custom tail components, prioritizing over content | `Component` | - |

### AnimationConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| fadeDuration | Fade-in duration (milliseconds) | `number` | `200` |
| easing | easing function | `string` | `'ease-in-out'` |
| splitBy | Fade into the unit. 'chunk' Fade in each new text separately; 'sentence' Merge into the current sentence | `'chunk' \| 'sentence'` | `'chunk'` |
| delimiters | The delimiter when `splitBy` is `sentence` | `string[]` | `['. ', '! ', '? ', '.', '!', '?', '\n']` |
| maxSentenceChars | The maximum number of characters in a fade-in unit when `splitBy` is `sentence` | `number` | `120` |

### debug

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| debug | Enable the FPS / memory performance overlay, including recording and a performance chart | `boolean` | `false` |

> `debug` is for development only. Disable it in production to avoid extra overhead and information exposure.

### Custom component caching

`arePropsEqualIgnoringDomNode` is exported in parity with React 2.10. It ignores the `domNode` reference that changes on every parse and shallow-compares the remaining props. Vue has no public `React.memo` render-bailout equivalent, so use it in your own cache or third-party rendering adapter; prefer `incremental` to reduce repeated parsing while streaming.

```ts
import { arePropsEqualIgnoringDomNode } from '@ant-design-x-vue/x-markdown';

const unchanged = arePropsEqualIgnoringDomNode(previousProps, nextProps);
```

### Incomplete syntax conversion

When `hasNextChunk` is `true` and `incompleteMarkdown` is `placeholder` (default), the unfinished syntax token will be converted into `incomplete-<token>` form, and the original text is returned through `data-raw` (`encodeURIComponent`). When `incompleteMarkdown: 'complete'` is set, the emphasis / inline code / link text / list item will be displayed immediately as completed text as much as possible; pictures, HTML, and tables will still use placeholder logic.

You can use `incompleteMarkdownComponentMap` to replace the default label name with a custom name (for example, `link: 'link-loading'`), and then register the corresponding component in `components`. Explicitly configured mappings take precedence over `complete` mode.

### StreamCacheTokenType

Consistent with React `@ant-design/x-markdown@2.10` source code enumeration:

```ts
type StreamCacheTokenType =
  | 'text' // 纯文本（不生成占位标签）
  | 'link' // 链接 [text](url)
  | 'image' // 图片 ![alt](src)
  | 'html' // HTML / 自定义标签 <tag>
  | 'emphasis' // 强调 *斜体* **粗体**
  | 'list' // 列表 - + *
  | 'table' // 表格 | header | content |
  | 'inline-code'; // 行内代码 `code`
```

### Supported syntax types

| Syntax type | Format example | Processing mechanism | Unfinished example | TokenType |
| --- | --- | --- | --- | --- |
| **Link** | `[text](url)` | Detect unclosed link tags | `[Example](https://example` | `link` |
| **Image** | `![alt](src)` | Detect unclosed image tags | `![Product](https://cdn.example.com/images/produc` | `image` |
| **HTML** | `<tag\>` | Processing HTML / custom tag closing state | `<div class="` | `html` |
| **Emphasis** | `*italic*` `**bold**` | Processing `*` / `_` emphasized unclosed | `**Unfinished bold` | `emphasis` |
| **List** | `- + *` | Detect spaces after list tags | `-` | `list` |
| **Table** | [GFM Table](https://github.github.com/gfm/#tables-extension-) | Detect unclosed table rows/cells | `\| Header1 \| Header2 \|` | `table` |
| **Inline code** | `` `code` `` | Detect unclosed inline code | `` `partial `` | `inline-code` |

### Minimal configuration

```vue
<script setup lang="ts">
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const content = '...';
const isStreaming = true;
</script>

<template>
  <!-- 布尔预设：incremental + incompleteMarkdown:complete + typewriter -->
  <XMarkdown :content="content" :streaming="isStreaming" />

  <!-- 或对象形式细调 -->
  <XMarkdown
    :content="content"
    :streaming="{
      hasNextChunk: isStreaming,
      enableAnimation: true,
      tail: true,
      incompleteMarkdown: 'complete',
    }"
  />
</template>
```

## FAQ

### Why streaming syntax handling is needed

When streaming, Markdown may stop halfway, for example:

```markdown
[Example Website](https://example
![Product Image](https://cdn.example.com/images/produc
```

Incomplete structures may cause links not to jump, images fail to load, or formatting tags to display directly in the text.

### Why `hasNextChunk` should not stay true forever

`hasNextChunk` should not always be `true`, otherwise:

1. **Syntax keeps pending**: unclosed links, images, etc., will remain in a loading/placeholder state
2. **Experience worsens**: users only see continuous loading and cannot get the complete content
3. **State accumulation**: cache and placeholder states cannot be properly finalized and cleaned up

With boolean preset, switch `streaming` from `true` to `false` to end the stream and render based on the final content (`keepSectionsOnEnd` defaults to keeping already segmented sections to avoid remounting custom components already mounted).
