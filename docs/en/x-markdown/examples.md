# Examples

Used to render the streamed Markdown returned by LLM. The following is arranged according to the `@ant-design/x-markdown@2.10.0` “Code Examples.” Each one represents a capability already implemented in Vue.

The editable preview is at [Online Experience](/en/x-markdown/playground), using the same input box as the basic usage.

## Basic usage

:::demo-v2 Basic Markdown rendering. Edits in the textarea redraw immediately.

x-markdown/basic

:::

## Streaming handling

:::demo-v2 Feed incomplete content chunk by chunk, then turn streaming off.

x-markdown/streaming

:::

## Using plugins

:::demo-v2 `plugins`’s `transform` rewrites the string before marked. Formulas, highlighting, and Mermaid see the corresponding plugin pages.

x-markdown/plugins

:::

## Custom components

:::demo-v2 `components` maps tags to its own Vue components.

x-markdown/components

:::

## LaTeX

:::demo-v2 `Latex` plugin.

x-markdown/latex

:::

## Code highlighting

:::demo-v2 `HighlightCode`。

x-markdown/highlight

:::

## Mermaid

:::demo-v2 When the fence language is mermaid, it is handled by `Mermaid`.

x-markdown/mermaid

:::

## Theme

:::demo-v2 light / dark class names.

x-markdown/themes

:::

## Custom tokenizer

:::demo-v2 Uses marked `extensions` to parse `%` headings into heading elements.

x-markdown/tokenizer

:::

## Token handling with walkTokens

:::demo-v2 Uses `config.walkTokens` to rewrite or intercept tokens.

x-markdown/walk-tokens

:::

## Pre-render handling with renderer

:::demo-v2 Custom marked `renderer`, then with `components` replacing tags.

x-markdown/renderer

:::

## Chinese link handling

:::demo-v2 When a bare URL is followed by Chinese text or parentheses, truncate the link and keep the suffix.

x-markdown/chinese-link

:::

## XSS defense

:::demo-v2 DOMPurify strips dangerous scripts, event attributes, and javascript: links.

x-markdown/xss

:::

## Streaming syntax

:::demo-v2 Incomplete links and tables use placeholders instead of half-parsed Markdown.

x-markdown/streaming-syntax

:::

## Streaming animation

:::demo-v2 `streaming.enableAnimation` makes newly appearing paragraphs fade in.

x-markdown/animation

:::

## Open links in a new tab

:::demo-v2 `openLinksInNewTab` adds `target="_blank"` to links.

x-markdown/open-links

:::

## Thinking process

:::demo-v2 Hand a custom tag to `Think`.

x-markdown/think

:::

## API

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content to be rendered | `string` | - |
| children | Markdown content, alias of `content` | `string` | - |
| components | Replace HTML/custom tags with custom Vue components, see [Component Overview](/en/x-markdown/components) for details | `Record\<string, Component\>` | - |
| paragraphTag | The HTML tag used by the paragraph. When a custom component contains block-level elements, it can be changed to `div` to avoid illegal nesting | `string` | `'p'` |
| streaming | Streaming rendering configuration, see [Streaming syntax](/en/x-markdown/streaming) | `boolean \| StreamingOption` | - |
| config | marked parsing and extension configuration | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| plugins | Compatible with old writing methods: objects with `transform(content)` will rewrite the string before parsing; use `config` + marked extensions first | `any[]` | - |
| openLinksInNewTab | Whether to add `target="_blank"` (and `rel="noopener noreferrer"`) to all `a` tags | `boolean` | `false` |
| dompurifyConfig | DOMPurify configuration for HTML disinfection and XSS protection | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| componentsProps | Pass additional props to custom components in `components` according to tag names to keep component references stable and avoid repeated mounting caused by inline functions | `Record\<string, Record\<string, unknown\>\>` | - |
| protectCustomTagNewlines | Whether to protect blank line segments inside custom tags to prevent paragraph segmentation from destroying the tag structure | `boolean` | `false` |
| disableCustomTagBlockMarkdown | Whether disabled block-level Markdown parsing (list, title, quote, etc.) within custom tags; inline Markdown still takes effect | `boolean` | `false` |
| escapeRawHtml | Whether to escape the original HTML in Markdown into plain text for display (not parsed into real HTML) to prevent XSS while retaining the content | `boolean` | `false` |
| debug | Enable the FPS / memory performance overlay (development only) | `boolean` | `false` |
| disableDefaultStyles | Whether to turn off the default style of built-in tags. `true` closes all, the array is closed by label (such as `['ul', 'ol', 'li']`), used to avoid default styles from polluting internal elements of custom components | `boolean \| Array<'p' \| 'ul' \| 'ol' \| 'li' \| 'pre' \| 'code' \| 'table' \| 'th' \| 'td' \| 'img' \| 'hr'\>` | `false` |
| className | Root node additional CSS class name | `string` | - |
| rootClassName | Alias of `className` | `string` | - |
| style | Root inline style | `CSSProperties` | - |
| prefixCls | CSS Override class prefix | `string` | - |

### StreamingOption

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is another chunk after it. Refresh the cache and complete rendering when `false` | `boolean` | `false` |
| enableAnimation | Enable text fade-in for block-level elements (`p`, `li`, `h1`–`h4`) | `boolean` | `false` |
| animationConfig | Text appearance animation configuration | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| incompleteMarkdownComponentMap | Custom component name corresponding to incomplete syntax. When streaming output encounters unclosed links, tables, HTML, etc., you can wrap the fragments with placeholder/loading components | `Partial\<Record\<Exclude\<StreamCacheTokenType, 'text'\>, string\>\>` | `{}` |

#### AnimationConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| fadeDuration | Fade-in animation duration (milliseconds) | `number` | `200` |
| easing | easing function | `string` | `'ease-in-out'` |

### ComponentProps

Customize the input parameters received by the `components` mapping component:

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Parsed DOM node information (tag name, attributes, child node structure) | `DOMNode` | - |
| streamStatus | Streaming status: `loading` means the block is still outputting, `done` means it has been closed. Currently mainly covers HTML and fenced code; indented code blocks have no explicit end marker and are always `done`. `code` can also read `data-state` | `'loading' \| 'done'` | - |
| block | Only for `code`: block-level code when `data-block="true"` | `boolean` | - |
| children | Content wrapped by the component | `VNode[] \| string` | - |
| Others | Standard HTML attributes (`href`, `title`, `class` / `className`, etc.) and custom `data-*` | `Record\<string, any\>` | - |

### StreamCacheTokenType

Consistent with the source code `StreamCacheTokenType` enum (note it is `html`, not `heading` / `xml` from the old document):

```ts
type StreamCacheTokenType =
  | 'text' // 纯文本
  | 'link' // 链接 [text](url)
  | 'image' // 图片 ![alt](src)
  | 'html' // HTML / 自定义标签 <tag>
  | 'emphasis' // 强调 *斜体* **粗体**
  | 'list' // 列表 - + *
  | 'table'; // 表格 | header | content |
```

When `hasNextChunk` is `true`, unfinished tokens will be converted to `incomplete-<token>` (can be renamed using `incompleteMarkdownComponentMap`), and the original text is stored in `data-raw` (`encodeURIComponent`). `text` does not generate placeholder tags.

## FAQ

### Difference between components and config marked extensions

#### config marked extensions (parser extensions)

[`extensions`](https://marked.js.org/using-pro#extensions) in `config` take effect in the **Markdown → HTML** phase:

- **Phase**: Markdown parsing
- **Purpose**: Identify and transform special syntax
- **Example**: Convert footnote syntax `[^1]` into ``<footnote>1</footnote>``
- **Use case**: Extend Markdown syntax

```ts
const footnoteExtension = {
  name: 'footnote',
  level: 'inline',
  start(src) {
    return src.match(/\[\^/)?.index;
  },
  tokenizer(src) {
    const rule = /^\[\^([^\]]+)\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'footnote',
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token) {
    return `<footnote>${token.text}</footnote>`;
  },
};

// <XMarkdown content="脚注示例[^1]" :config="{ extensions: [footnoteExtension] }" />
```

#### components (component replacement)

`components` replaces tags with Vue components during the **HTML → VNode** stage:

- **Stage**: Rendering
- **Function**: Replaces HTML/custom tags
- **Example**: Replaces ``<footnote>1</footnote>`` with a clickable footnote component
- **Scenario**: Custom styles and interactions

See full example in [Custom Plugin](/en/x-markdown/custom-plugin).
