# XMarkdown 流式语法

`streaming` 可以是布尔值，也可以是对象。对象字段：

| 字段 | 说明 | 默认 |
| --- | --- | --- |
| hasNextChunk | 后面还有 chunk。未闭合的语法先不按 Markdown 解析 | false |
| enableAnimation | 文本淡入 | false |
| animationConfig | `fadeDuration`、`easing` | 200ms，ease-in-out |
| incompleteMarkdownComponentMap | 未完成语法要用的组件名 | {} |

`hasNextChunk` 为 true 时，未完成的链接、图片、标题、强调、列表、表格、XML 会换成占位标签，原始片段放在 `data-raw`（`encodeURIComponent`）。默认标签名是 `incomplete-<token>`，例如半截链接变成 `incomplete-link`。

支持的 token：`text`、`link`、`image`、`heading`、`emphasis`、`list`、`table`、`xml`。`text` 不生成占位标签。

:::demo-v2 对齐 React 流式页：上方切换 Mixed / Link / Image / Html / Table / Emphasis / InlineCode，左边是正在打出的源码，右边是渲染结果。没写完的链接显示 16px 占位图标，而不是原始 `[text](url`。Re-Render 与 Run Stream 都会重头打字，并打开淡入。`streaming.tail` 和 `debug` 性能面板还不在 Vue 2.0 的 StreamingOption 里，尾标 `▋` 由示例自己画在结果后面。

x-markdown/streaming-syntax

:::

逐字输出还可以只用布尔 `streaming`，见 [富文本页的流式示例](/x-markdown/introduce)。
