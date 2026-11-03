# useXChat

管理一轮会话里的消息。必须传入 `provider`。没有 provider 时，`onRequest` 和 `abort` 抛出 `provider is required`。

```ts
const {
  onRequest,
  onReload,
  abort,
  messages,
  parsedMessages,
  setMessages,
  setMessage,
  isRequesting,
} = useXChat({
  provider,
  conversationKey: activeConversationKey,
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: { role: 'assistant', content: 'failed' },
});
```

| 返回值 | 说明 |
| --- | --- |
| onRequest | 发一轮请求 |
| onReload | 按消息 id 重放 |
| abort | 中止当前请求 |
| messages | 原始消息，带 `id`、`status`、`message` |
| parsedMessages | 经过 `parser` 之后给气泡用的列表 |
| setMessages / setMessage | 改列表或单条 |
| isRequesting | 是否在请求，computed |

状态：`local`、`loading`、`updating`、`success`、`error`、`abort`。

`conversationKey` 可以是字符串，也可以是 `useXConversations` 返回的 `activeConversationKey`。

### 模型接入

:::demo-v2 `createOpenAIChatProvider` + 本地 SSE mock：输入、流式气泡、取消。

x-sdk/x-chat/model

:::

### 思考模型接入

:::demo-v2 `DeepSeekChatProvider` 解析 `reasoning_content`，配合 Think + XMarkdown；仍走本地 mock。

x-sdk/x-chat/deepSeek

:::

### 历史消息设置

:::demo-v2 `defaultMessages` 预填用户与助手历史，再继续对话。

x-sdk/x-chat/defaultMessages

:::

### 系统提示词设置

:::demo-v2 `role: 'developer'` 作为系统提示，可在页面上修改。

x-sdk/x-chat/developer

:::

### 自定义 request

:::demo-v2 `DefaultChatProvider` + 自定义 `fetch`，返回 JSON mock。

x-sdk/x-chat/custom-request

:::

1.x 的 `useXChat({ agent })` 现在叫 `useLegacyXChat`，文档在 [useXChat 数据管理](https://antd-design-x-vue.netlify.app/component/use-x-chat)。

> React 文档还有 `openai-node` 自定义 request 示例（依赖 `openai` 包）。Vue 文档暂不引入该依赖，见 PR 说明中的缺口列表。
