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

:::demo-v2 和 Chat Provider 页同一条本地链路：输入、流式气泡、取消。

x-sdk/preset

:::

1.x 的 `useXChat({ agent })` 现在叫 `useLegacyXChat`，文档在 [useXChat 数据管理](/v1/component/use-x-chat)。
