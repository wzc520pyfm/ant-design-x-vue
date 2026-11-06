# Introduction

Stream-friendly, extensible Markdown rendering component. Aligns with the core capabilities of `@ant-design/x-markdown@2.0.0`: formulas, code highlighting, Mermaid, stream syntax, and custom component mapping.

## When to use

- Render Markdown content in chat bubbles, messages, and other scenarios
- Use `streaming` and `useStreaming` when streaming output is needed
- Use `components` mapping when custom headers, code blocks, Mermaid, and other nodes are needed

More detailed pages:

- [Code examples and full API](/en/x-markdown/examples)
- [Plugins: Latex, HighlightCode, Mermaid, Custom transform](/en/x-markdown/plugins)
- [Themes light / dark](/en/x-markdown/themes)
- [Streaming syntax](/en/x-markdown/streaming)
- [Overview of component mappings](/en/x-markdown/components)

## Examples

### Basic usage

:::demo-v2 You can render by passing a Markdown string through `content`.

x-markdown/basic

:::

### Custom components mapping

:::demo-v2 Map HTML tags to custom Vue components through `components`, which can receive props like `domNode`, `streamStatus`, `children`, etc.

x-markdown/components

:::

### Streaming render

:::demo-v2 Use `streaming` to indicate streaming state, combined with `useStreaming` to handle content and state.

x-markdown/streaming

:::

## API

The full table (including `children`, `paragraphTag`, `openLinksInNewTab`, `dompurifyConfig`, `componentsProps`, `escapeRawHtml`, `disableDefaultStyles`, `protectCustomTagNewlines`, `disableCustomTagBlockMarkdown`, `rootClassName`, `style`, etc.) can be found in [Code Examples · API](/en/x-markdown/examples). Common fields are listed here:

### XMarkdownProps

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content | `string` | - |
| children | Alias for `content` | `string` | - |
| streaming | Streaming configuration. Boolean indicates whether it is still outputting; object supports `hasNextChunk`, `enableAnimation`, `animationConfig`, `incompleteMarkdownComponentMap` | `boolean \| StreamingOption` | - |
| components | Maps tag names to custom Vue components (e.g., h1, pre, code, mermaid, think) | `Record\<string, Component\>` | - |
| paragraphTag | Paragraph HTML tag, avoid illegal nesting of custom block components | `string` | `'p'` |
| plugins | List of plugins, transforms content before parsing | `any[]` | - |
| config | Marked parsing configuration | `MarkedConfig` | - |
| openLinksInNewTab | Add `target="_blank"` to all links | `boolean` | `false` |
| dompurifyConfig | DOMPurify sanitization configuration | `DOMPurify.Config` | - |
| className | Root class name | `string` | - |
| rootClassName | Alias of `className` | `string` | - |
| style | Root inline style | `CSSProperties` | - |

### StreamingOption / AnimationConfig

| Field | Description | Default |
| --- | --- | --- |
| hasNextChunk | There is another chunk following. Unclosed syntax is not fully parsed as Markdown | `false` |
| enableAnimation | Text fade-in | `false` |
| animationConfig.fadeDuration | Fade-in duration (milliseconds) | `200` |
| animationConfig.easing | Easing | `'ease-in-out'` |
| incompleteMarkdownComponentMap | Component names for unfinished syntax (token is `link` / `image` / `html` / `emphasis` / `list` / `table`) | `{}` |

### ComponentProps (custom component props)

| Prop | Description | Type |
| --- | --- | --- |
| domNode | Parsed DOM node information (name, attribs, children) | `DOMNode` |
| streamStatus | When a custom tag is not closed, it is `'loading'`; after closing, it is `'done'`. `code` can read `data-state` | `'loading' | 'done'` |
| block | Only for `code`: when `data-block="true"`, it is block-level code | `boolean` |
| children | Child content (VNode or text) | `VNode[] | string` |
| others | Standard HTML attributes and data-* etc. | `Record\<string, any\>` |

### useStreaming

Used as a composable function for streaming content.

| Argument | Description | Type |
| --- | --- | --- |
| content | Content ref | `Ref\<string\>` |
| streaming | Ref indicating whether streaming is in progress (optional) | `Ref\<boolean\>` |
| onComplete | Callback when streaming ends | `() => void` |

| Return value | Description | Type |
| --- | --- | --- |
| displayedContent | Currently displayed content | `Ref\<string\>` |
| status | Status: idle | streaming | complete | error | `Ref\<StreamStatus\>` |
| isStreaming | Whether it is streaming | `Ref\<boolean\>` |

### Exports

- `XMarkdown` - Main component
- `AnimationText` - Text fade-in component (`streaming.enableAnimation`)
- `useStreaming` - Streaming composition function
- `parseMarkdown(content, config?)` - Parse Markdown into HTML
- `htmlToVNode(html, options?)` - Convert HTML to VNode (supports components, streamStatus)
