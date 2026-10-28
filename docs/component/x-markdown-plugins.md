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

`Latex(options?)` 返回 marked extensions，传给 `config.extensions`。默认把 `align*` 换成 `aligned`。`katexOptions` 原样交给 KaTeX，默认 `throwOnError: false`。

:::demo-v2 行内 `$...$` 和块级 `$$`。

x-markdown/latex

:::

## HighlightCode

围栏代码渲染成 `<code class="language-*">`。用 `components.code` 读 class，再交给 `HighlightCode`。行内代码保持普通 `<code>`。

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| lang | 语言名 | string |
| children | 代码文本 | string |
| header | 顶栏。`null` 时不渲染默认顶栏 | VNode \| null |

:::demo-v2 围栏代码走 HighlightCode。

x-markdown/highlight

:::

## Mermaid

`components.code` 在语言是 `mermaid` 时换成 `Mermaid`。图表库只在浏览器里初始化，服务端渲染先显示源码。

:::demo-v2 一段流程图。

x-markdown/mermaid

:::

## Think

自定义标签可以映射到对话组件。`think` 交给 `Think`，默认插槽就是标签里的文本。`Sources` 用同样的 `components` 写法。

:::demo-v2 把 think 标签渲染成 Think。

x-markdown/think

:::

## 主题和文案

`HighlightCode` 和 `Mermaid` 的按钮文案来自 `useLocale`。用 [XProvider](/component/x-provider-v2) 包一层即可替换。样式类名见 [主题](/component/x-markdown-themes)。
