# 代码示例

用于渲染 LLM 返回的流式 Markdown。下面按 `@ant-design/x-markdown@2.0.0` 的「代码示例」排列。每一则都是 Vue 已经实现的能力。

可编辑的预览在 [在线体验](/x-markdown/playground)，和基础用法是同一块输入框。

## 基础用法

:::demo-v2 markdown 基础语法渲染。文本框里改内容会立刻重绘。

x-markdown/basic

:::

## 流式处理

:::demo-v2 未完成内容逐段送入，结束后关闭 streaming。

x-markdown/streaming

:::

## 插件使用

:::demo-v2 `plugins` 的 `transform` 在 marked 之前改写字符串。公式、高亮、Mermaid 见对应插件页。

x-markdown/plugins

:::

## 自定义组件

:::demo-v2 `components` 把标签映射成自己的 Vue 组件。

x-markdown/components

:::

## 公式

:::demo-v2 `Latex` 插件。

x-markdown/latex

:::

## 代码高亮

:::demo-v2 `HighlightCode`。

x-markdown/highlight

:::

## Mermaid

:::demo-v2 围栏语言是 mermaid 时交给 `Mermaid`。

x-markdown/mermaid

:::

## 主题

:::demo-v2 light / dark 类名。

x-markdown/themes

:::

## 流式语法

:::demo-v2 未闭合的链接、表格等先占位，不按半截 Markdown 解析。

x-markdown/streaming-syntax

:::

## 流式动画

:::demo-v2 `streaming.enableAnimation` 让新出现的段落淡入。

x-markdown/animation

:::

## 新标签页打开链接

:::demo-v2 `openLinksInNewTab` 给链接加上 `target="_blank"`。脚本标签会被 DOMPurify 去掉。

x-markdown/open-links

:::

## 思考过程

:::demo-v2 自定义标签交给 `Think`。

x-markdown/think

:::
