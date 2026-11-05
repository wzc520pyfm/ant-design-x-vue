# Mermaid · GPT-VIS

语言是 `mermaid` 的围栏代码可以交给 `Mermaid`，在浏览器里画图。服务端先显示源码。从 `@ant-design-x-vue/x-markdown/plugins/Mermaid` 引入。

## Mermaid

:::demo-v2 一段流程图。

x-markdown/mermaid

:::

:::demo-v2 流式输出 Mermaid 围栏时逐步渲染。

x-markdown/mermaid-streaming

:::

### Mermaid API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 图表源码 | `string` | - |
| header | 顶栏。传入 VNode 则完全自定义；`null` 时不渲染默认工具栏 | `VNode \| null` | 默认缩放 / 复制 / 下载 / 代码切换 |
| className | 根节点类名 | `string` | - |
| classNames | 语义化类名：`root` / `header` / `graph` / `code` | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', string>>` | - |
| styles | 语义化样式，键与 `classNames` 相同 | `Partial<Record<..., CSSProperties>>` | - |
| style | 根节点内联样式 | `CSSProperties` | - |
| prefixCls | 类名前缀覆盖 | `string` | - |

工具栏文案来自 `useLocale('Mermaid')`，见 [主题与文案](/x-markdown/plugin-theme-locale)。

## GPT-VIS

自定义标签也可以映射成图表。下面用 `custom-line` 配合 docs 里的 GPT-VIS Line 适配层（避免打进完整 G6 包）。

:::demo-v2 流式输出结束后渲染折线图。

x-markdown/data-chart

:::

步骤总览见 [插件 · Mermaid](/x-markdown/plugins)。
