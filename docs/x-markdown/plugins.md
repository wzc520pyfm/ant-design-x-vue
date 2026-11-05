# XMarkdown 插件

插件分两类。`plugins` 里带 `transform(content)` 的对象会在解析前改写 Markdown 字符串。公式、高亮、Mermaid 走 marked 扩展或 `components` 映射，和 React `@ant-design/x-markdown@2.0.0` 一样。

发布包里的子路径：

- `@ant-design-x-vue/x-markdown/plugins/Latex`
- `@ant-design-x-vue/x-markdown/plugins/HighlightCode`
- `@ant-design-x-vue/x-markdown/plugins/Mermaid`

主入口也导出这三个名字。浏览器脚本包没有单独再打一份 `dist/plugins/*.min.js`，请用包入口或子路径。

## 字符串 transform

:::demo-v2 `plugins` 的 `transform` 在 marked 之前运行。

x-markdown/plugins

:::

## Latex

`Latex(options?)` 返回 marked extensions，传给 `config.extensions`。默认把 `align*` 换成 `aligned`。`katexOptions` 原样交给 KaTeX。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| replaceAlignStart | 是否把 `align*` 换成 `aligned` | `boolean` | `true` |
| katexOptions | KaTeX 配置 | [`KatexOptions`](https://katex.org/docs/options) | `{ output: 'html', throwOnError: false }` |

:::demo-v2 行内 `$...$` 和块级 `$$`。

x-markdown/latex

:::

:::demo-v2 流式输出公式时逐步解析。

x-markdown/latex-streaming

:::

独立页：[公式](/x-markdown/plugin-latex)。

## HighlightCode

围栏代码渲染成 `<code class="language-*">`。用 `components.code` 读 class，再交给 `HighlightCode`。行内代码保持普通 `<code>`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| lang | 语言名 | `string` | - |
| children | 代码文本 | `string` | - |
| header | 顶栏；`null` 时不渲染默认顶栏 | `VNode \| null` | 默认顶栏 |
| className | 根节点类名 | `string` | - |
| classNames | `root` / `header` / `headerTitle` / `code` | `object` | - |
| styles | 与 `classNames` 对应的内联样式 | `object` | - |

:::demo-v2 围栏代码走 HighlightCode。

x-markdown/highlight

:::

:::demo-v2 流式输出代码块时逐步高亮。

x-markdown/highlight-streaming

:::

独立页：[高亮 Code](/x-markdown/rich-text)。

## Mermaid

`components.code` 在语言是 `mermaid` 时换成 `Mermaid`。图表库只在浏览器里初始化，服务端渲染先显示源码。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 图表源码 | `string` | - |
| header | 顶栏；`null` 时不渲染默认工具栏 | `VNode \| null` | 默认工具栏 |
| className | 根节点类名 | `string` | - |
| classNames | `root` / `header` / `graph` / `code` | `object` | - |
| styles | 与 `classNames` 对应的内联样式 | `object` | - |

:::demo-v2 一段流程图。

x-markdown/mermaid

:::

:::demo-v2 流式输出 Mermaid 围栏时逐步渲染。

x-markdown/mermaid-streaming

:::

独立页：[Mermaid · GPT-VIS](/x-markdown/data-display)。

## Think

自定义标签可以映射到对话组件。`think` 交给 `Think`，默认插槽就是标签里的文本。`Sources` / `ThoughtChain` 用同样的 `components` 写法，见 [对话增强](/x-markdown/chat-enhancement)。

:::demo-v2 把 think 标签渲染成 Think。

x-markdown/think

:::

## 主题和文案

`HighlightCode` 和 `Mermaid` 的按钮文案来自 `useLocale`。用 [XProvider](/component/x-provider) 包一层即可替换。样式可用组件 `styles` / `classNames`，或跟随 ant-design-vue Design Token。详见 [主题与文案](/x-markdown/plugin-theme-locale)。Markdown 正文主题类名见 [主题](/x-markdown/themes)。

## 自定义插件

支持 marked extensions 或带 `transform` 的自定义插件，见 [自定义插件](/x-markdown/custom-plugin)。
