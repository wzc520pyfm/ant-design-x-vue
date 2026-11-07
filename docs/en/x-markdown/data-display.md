# Mermaid · GPT-VIS

Fenced code in the language `mermaid` can be handed over to `Mermaid` to draw diagrams in the browser. On the server side, the source code is displayed first. Import from `@ant-design-x-vue/x-markdown/plugins/Mermaid`.

## Mermaid

:::demo-v2 A flowchart.

x-markdown/mermaid

:::

:::demo-v2 Progressively render a streaming Mermaid fence.

x-markdown/mermaid-streaming

:::

### Mermaid API

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| children | Chart source code | `string` | - |
| header | Top bar. Passing VNode is fully customizable; 'null' does not render the default toolbar | `VNode \| null` | Default zoom / copy / download / code switch |
| className | Root class name | `string` | - |
| classNames | Semantic class names: 'root' / 'header' / 'graph' / 'code' | `Partial\<Record<'root' \| 'header' \| 'graph' \| 'code', string\>\>` | - |
| styles | Semantic styling, key identical to 'classNames' | `Partial\<Record<..., CSSProperties\>\>` | - |
| style | Root inline style | `CSSProperties` | - |
| prefixCls | Override class prefix | `string` | - |

Toolbar copy comes from 'useLocale('Mermaid')', see [Theme and Copywriting](/en/x-markdown/plugin-theme-locale).

## GPT-VIS

Custom tags can also be mapped to charts. Next, use 'custom-line' together with the GPT-VIS Line adaptation layer in docs (avoid loading into the full G6 package).

:::demo-v2 Render a line chart after the stream finishes.

x-markdown/data-chart

:::

See the overall steps at [Plugin · Mermaid](/en/x-markdown/plugins).
