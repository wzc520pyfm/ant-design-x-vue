# XMarkdown plugins

Plug-ins are divided into two categories. Objects with `transform(content)` in `plugins` will rewrite the Markdown string before parsing. Formulas, highlighting, and Mermaid use the marked extension or `components` mapping, just like React `@ant-design/x-markdown@2.0.0`.

Publish the subpath in the package:

- `@ant-design-x-vue/x-markdown/plugins/Latex`
- `@ant-design-x-vue/x-markdown/plugins/HighlightCode`
- `@ant-design-x-vue/x-markdown/plugins/Mermaid`

The main entrance also exports these three names. The browser script package does not have a separate copy of `dist/plugins/*.min.js`, please use the package entry or subpath.

## String transform

:::demo-v2 The `transform` of `plugins` runs before `marked`.

x-markdown/plugins

:::

## Latex

`Latex(options?)` returns marked extensions, which are passed to `config.extensions`. By default, `align*` is replaced with `aligned`. `katexOptions` are passed directly to KaTeX.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| replaceAlignStart | Whether to replace `align*` with `aligned` | `boolean` | `true` |
| katexOptions | KaTeX configuration | [`KatexOptions`](https://katex.org/docs/options) | `{ output: 'html', throwOnError: false }` |

:::demo-v2 Inline `$...$` and block `$$`.

x-markdown/latex

:::

:::demo-v2 Progressively parse formulas while they stream.

x-markdown/latex-streaming

:::

Standalone page: [Formulas](/en/x-markdown/plugin-latex).

## HighlightCode

Fenced code is rendered as `<code class="language-*">`. The class is read via `components.code` and then passed to `HighlightCode`. Inline code remains as standard `<code>`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| lang | Language name | `string` | - |
| children | Code text | `string` | - |
| header | Top bar; if `null`, the default top bar is not rendered | `VNode \| null` | Default top bar |
| className | Root class name | `string` | - |
| classNames | `root` / `header` / `headerTitle` / `code` | `object` | - |
| styles | Inline styles corresponding to `classNames` | `object` | - |

:::demo-v2 Fenced code goes through HighlightCode.

x-markdown/highlight

:::

:::demo-v2 Progressively highlight a streaming code block.

x-markdown/highlight-streaming

:::

Standalone page: [Highlighted Code](/en/x-markdown/rich-text).

## Mermaid

`components.code` is replaced by `Mermaid` when the language is `mermaid`. The chart library is only initialized in the browser, and server-side rendering displays the source code first.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| children | Chart source code | `string` | - |
| header | Top bar; do not render the default toolbar when `null` | `VNode \| null` | Default toolbar |
| className | Root class name | `string` | - |
| classNames | `root` / `header` / `graph` / `code` | `object` | - |
| styles | Inline styles corresponding to `classNames` | `object` | - |

:::demo-v2 A flowchart.

x-markdown/mermaid

:::

:::demo-v2 Progressively render a streaming Mermaid fence.

x-markdown/mermaid-streaming

:::

Independent page: [Mermaid · GPT-VIS](/en/x-markdown/data-display).

## Think

Custom labels can be mapped to dialog components. `think` is handed over to `Think`, the default slot is the text in the label. `Sources` / `ThoughtChain` use the same `components` notation, see [Chat Enhancement](/en/x-markdown/chat-enhancement).

:::demo-v2 Render think tags as Think.

x-markdown/think

:::

## Theme and copy

The button text of `HighlightCode` and `Mermaid` comes from `useLocale`. Use [XProvider](/en/component/x-provider) to wrap it up and replace it. Styles are available in the components `styles` / `classNames`, or follow the ant-design-vue Design Token. See [Theme and Copy](/en/x-markdown/plugin-theme-locale) for details. For the Markdown text theme class name, see [theme](/en/x-markdown/themes).

## Custom plugin

Supports marked extensions or custom plug-ins with `transform`, see [custom plug-in](/en/x-markdown/custom-plugin).
