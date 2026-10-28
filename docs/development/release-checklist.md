# 2.0 核对清单

对照 React `@ant-design/x@2.0.0`（tag `2.0.0`）。这页记录本分支相对那一版的对齐情况。命令结果以最近一次本地验证为准，发布前再跑一遍。

## 已对齐

- 主包导出 2.0 的 `useXChat`、`useXConversations`、`XRequest`、`XStream`，以及 `OpenAIChatProvider`、`DeepSeekChatProvider`、`DefaultChatProvider`、`AbstractChatProvider`。
- `createOpenAIChatProvider` / `resolvePresetApiKey` 接上 1.x 预设协议：手动 `XRequest` + OpenAI Chat Completions。`useXAgent` 仍只服务 1.x 示例。
- XMarkdown 页面覆盖插件、Latex、HighlightCode、Mermaid、Think 映射、light/dark 主题、流式未完成语法。
- SDK 页面覆盖介绍、Provider、useXChat、useXConversations、XRequest、XStream。示例请求都在本地完成。
- 样板间在独立式、助手式之外补了现代感和百宝箱布局。
- `Bubble.List` 的 `roles`、`FileCard` 列表项 `key`、根节点 `class` 记在迁移文档里。

## 有意不同

- 根节点用 Vue `class`。声明了 `className` 的组件两个都收。
- `FileCard` 组件 props 不含 `key`。稳定标识在 `FileCard.List` 的 item 上。
- `Bubble.List` 同时接受 `roles` 和 `role`，同时传入时用 `roles`。

## 未镜像

- 现代感没有调用 DeepSeek，百宝箱没有调用 `tbox-nodejs-sdk`。后者是 Node SDK，文档站是浏览器。
- RICH 设计长文留在 React 文档，见 [设计范式](/development/spec)。
- React 的脚手架页（Next、Umi、Rsbuild、CRA）和 React FAQ 不迁。
- XMarkdown 没有单独的浏览器 `dist/plugins/*.min.js`。用包入口或 `plugins/*` 子路径。

## 发布

不要在这个分支执行 `npm publish`。三个包都是 `2.0.0` 时，先发 `@ant-design-x-vue/x-sdk`，再发 `ant-design-x-vue` 和 `@ant-design-x-vue/x-markdown`。包里不能留下 `workspace:*`。
