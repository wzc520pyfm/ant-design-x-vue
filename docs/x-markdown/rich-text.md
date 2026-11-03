# 高亮 Code

围栏代码渲染成带 `language-*` 的 `<code>`，再用 `components.code` 交给 `HighlightCode`。行内代码保持普通 `<code>`。

从 `@ant-design-x-vue/x-markdown/plugins/HighlightCode` 引入（主入口也导出同名）。

## 代码演示

:::demo-v2 基础高亮。

x-markdown/highlight

:::

:::demo-v2 流式高亮。

x-markdown/highlight-streaming

:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| lang | 语言名 | `string` | - |
| children | 代码文本 | `string` | - |
| header | 顶栏。传入 VNode 则完全自定义；`null` 时不渲染默认顶栏 | `VNode \| null` | 默认语言名 + 复制按钮 |
| className | 根节点类名 | `string` | - |
| classNames | 语义化类名：`root` / `header` / `headerTitle` / `code` | `Partial<Record<'root' \| 'header' \| 'headerTitle' \| 'code', string>>` | - |
| styles | 语义化样式，键与 `classNames` 相同 | `Partial<Record<..., CSSProperties>>` | - |
| style | 根节点内联样式 | `CSSProperties` | - |
| prefixCls | 类名前缀覆盖 | `string` | - |

复制按钮文案来自 `useLocale('HighlightCode')`，可用 [XProvider](/component/x-provider) 的 `locale` 切换，见 [主题与文案](/x-markdown/plugin-theme-locale)。

属性和更多示例也在 [插件 · HighlightCode](/x-markdown/plugins)。
