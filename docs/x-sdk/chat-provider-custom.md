# Custom Chat Provider

协议对不上 OpenAI 或 DeepSeek 时，继承 `AbstractChatProvider`，实现三个方法：

- `transformParams(requestParams, options)`
- `transformLocalMessage(requestParams)`
- `transformMessage({ originMessage, chunk, chunks, status, responseHeaders })`

`request` 必须是 `manual: true` 的 `XRequest`。百宝箱这类智能体走这条路，见 [百宝箱样板间](/playground/agent-tbox)。

类的职责说明在 [Chat Provider](/x-sdk/chat-provider)。
