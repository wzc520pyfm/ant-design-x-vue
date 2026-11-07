# CodeHighlighter

Highlight formatted code. Aligned with React `@ant-design/x` CodeHighlighter.

> Standalone component. The Markdown plugin [`HighlightCode`](/en/x-markdown/plugins) is still available; the two serve different purposes (plugin ≠ this component).

> 中文：[CodeHighlighter 代码高亮](/component/code-highlighter)

## When to use

- Show syntax-highlighted snippets with copy and header language info.
- Combine with XMarkdown via `components.code` to render fenced code blocks.

## Examples

### Basic

:::demo-v2 Basic usage with on-demand language loading (`prismLightMode`).

code-highlighter/basic

:::

### Custom header

:::demo-v2 Customize the header with `header`. Pass `false` / `null` to hide it.

code-highlighter/custom-header

:::

### With XMarkdown

:::demo-v2 Use it as `components.code` inside Bubble + XMarkdown.

code-highlighter/with-xmarkdown

:::

## API

### CodeHighlighterProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| lang | Language id | `string` | - | - |
| children | Code content (or default slot) | `string` | - | - |
| header | Header content; hidden when `false` / `null` | `VNode \| string \| (() => VNode \| string \| false \| null) \| false \| null` | - | - |
| highlightProps | Extra options for the highlighter (`showLineNumbers` / `startingLineNumber` / `codeTagProps`, …) | `CodeHighlighterHighlightProps` | - | - |
| prismLightMode | Prism light mode (lazy-load by `lang`) | `boolean` | `true` | - |
| classNames | Semantic class names | `Partial\<Record\<SemanticType, string\>\>` | - | - |
| styles | Semantic styles | `Partial\<Record\<SemanticType, CSSProperties\>\>` | - | - |
| prefixCls | Class prefix | `string` | - | - |
| rootClassName | Extra class on the root | `string` | - | - |

### Slots

| Slot | Description |
| --- | --- |
| default | Code content (string) |
| header | Custom header |

### CodeHighlighter Ref

| Prop | Description | Type |
| --- | --- | --- |
| nativeElement | Native DOM node | `HTMLElement` |

### SemanticType

| Name | Description |
| --- | --- |
| root | Root |
| header | Header container |
| headerTitle | Title |
| code | Code container |

## Semantic DOM

<vp-semantic component="CodeHighlighter"></vp-semantic>

## Design Token

| Token | Description | Default |
| --- | --- | --- |
| colorBgTitle | Title background | `colorFillContent` |
| colorTextTitle | Title text | `colorText` |
| colorBorderCode | Code block border | `colorBorderSecondary` |

## Contributors

<doc-contributors component-name="code-highlighter" :max-count="50" :show-view-all="true" />
