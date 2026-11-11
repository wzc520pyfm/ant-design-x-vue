# Highlight Code

The fence code is rendered into `<code>` with `language-*`, and then passed to `HighlightCode` using `components.code`. Inline code remains normal `<code>`.

Import from `@ant-design-x-vue/x-markdown/plugins/HighlightCode` (the main entrance also exports the same name).

## Examples

:::demo-v2 Basic highlighting.

x-markdown/highlight

:::

:::demo-v2 Streaming highlighting.

x-markdown/highlight-streaming

:::

## API

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| lang | Language name | `string` | - |
| children | Code text | `string` | - |
| header | top bar. Passing in VNode is completely customized; if `null` is used, the default top bar will not be rendered | `VNode \| null` | Default language name + copy button |
| className | Root class name | `string` | - |
| classNames | Semantic class names: `root` / `header` / `headerTitle` / `code` | `Partial\<Record<'root' \| 'header' \| 'headerTitle' \| 'code', string\>\>` | - |
| styles | Semantic styling, key identical to 'classNames' | `Partial\<Record<..., CSSProperties\>\>` | - |
| style | Root inline style | `CSSProperties` | - |
| prefixCls | Override class prefix | `string` | - |

The copy button copy comes from `useLocale('HighlightCode')`, which can be switched with the `locale` of [XProvider](/en/component/x-provider), see [Theme and Copywriting](/en/x-markdown/plugin-theme-locale).

Properties and more examples are also in [plugins · HighlightCode](/en/x-markdown/plugins).
