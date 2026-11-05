# 自定义插件

可以用 [Marked extensions](https://marked.js.org/using_advanced#extensions)，也可以用带 `transform(content)` 的对象在解析前改写字符串。自定义标签再走 `components` 映射。

## 字符串 transform

:::demo-v2 `plugins` 的 `transform` 在 marked 之前把 `TODO` 加粗。

x-markdown/plugins

:::

## Marked extension：脚注

下面用 tokenizer / renderer 把 `[^n]` 转成 `<footnote>`，再映射成带 Popover 的组件（对齐 React `CustomPlugin/custom.tsx`）。

:::demo-v2 脚注语法 + components 映射。

x-markdown/custom-footnote

:::

## 与 components 的分工

| 方式 | 阶段 | 作用 |
| --- | --- | --- |
| `config.extensions` / marked 插件 | Markdown → HTML | 识别新语法，输出 HTML 标签 |
| `plugins[].transform` | 解析前 | 纯字符串改写 |
| `components` | HTML → VNode | 把标签换成 Vue 组件 |

更多 API 说明见 [代码示例 · FAQ](/x-markdown/examples)。
