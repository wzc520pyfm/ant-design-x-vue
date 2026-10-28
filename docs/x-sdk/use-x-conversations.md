# useXConversations

管理会话列表和当前会话。`conversations` 与 `activeConversationKey` 是 shallowRef，和 `useXChat` 的 `conversationKey` 对上之后，每个会话有自己的消息。

```ts
const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
  removeConversation,
  setConversation,
  setConversations,
  getConversation,
  getMessages,
} = useXConversations({
  defaultConversations: [{ key: '1', label: 'New chat' }],
  defaultActiveConversationKey: '1',
});
```

`addConversation(conversation, 'prepend' | 'append')`。会话对象至少要有 `key`。

:::demo-v2 新建会话并切换当前项。消息存在对应的 key 上，切换不会串台。

x-sdk/conversations

:::
