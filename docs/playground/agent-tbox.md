---
aside: false
---

# 百宝箱

React 2.0 的 agent-tbox 样板间用 `tbox-nodejs-sdk` 在 Node 里调百宝箱。那个包不能放进浏览器文档。这里保留 Welcome、Prompts、Think、ThoughtChain、会话栏和 Sender，回复由本地 Provider 生成。

要接真实 Tbox，在服务端继承 `AbstractChatProvider`，让 `transformMessage` 输出你们的消息结构，再把手动模式的 `XRequest` 指到自己的接口。

:::demo

playground/agent-tbox

:::
