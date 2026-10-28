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

:::demo-v2 半截链接先走自定义占位，点按钮后补全。

x-markdown/streaming-syntax

:::

逐字输出还可以只用布尔 `streaming`，见 [富文本页的流式示例](/component/x-markdown-v2)。
