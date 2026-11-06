# Custom Chat Provider

When the protocol does not match OpenAI or DeepSeek, inherit from `AbstractChatProvider` and implement three methods:

- `transformParams(requestParams, options)`
- `transformLocalMessage(requestParams)`
- `transformMessage({ originMessage, chunk, chunks, status, responseHeaders })`

`request` must be an `XRequest` with `manual: true`. Agents like Treasure Box follow this path, see [Treasure Box Sample](/en/playground/agent-tbox).

Class responsibilities are explained in [Chat Provider](/en/x-sdk/chat-provider).
