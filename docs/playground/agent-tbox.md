---
aside: false
---

# 百宝箱

版面对齐 React 2.10 的 agent-tbox：侧栏 Logo / 会话（新建、重命名占位、删除、`[当前对话]` 前缀）与 Avatar 页脚；空态 Welcome + 两组 Prompts；Sender 行提示词；气泡内 ThoughtChain.Item 状态头、XMarkdown（`ext_text` → `<think>`）+ Think、Actions（分页占位 / 重试 / 复制 / 语音 mock / 反馈）。

React 使用 Node 侧 `tbox-nodejs-sdk`，浏览器文档无法引入该包。本页用本地 `MockTboxProvider`（`AbstractChatProvider` + `AbstractXRequestClass`）按会话缓存 Provider，流式输出与 React Tbox 一致的 `{ text, ext_text }` 载荷。

:::demo

playground/agent-tbox

:::
