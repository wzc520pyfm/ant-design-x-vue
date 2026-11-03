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

### 基础使用

:::demo-v2 用 `useXConversations` 驱动会话列表。

x-sdk/x-conversations/basic

:::

### 会话操作

:::demo-v2 新建、更新、重置，以及菜单删除。

x-sdk/x-conversations/operations

:::

### 多实例

:::demo-v2 两个独立的 `useXConversations` 实例互不影响。

x-sdk/x-conversations/multi-instances

:::

### 配合 useXChat

:::demo-v2 切换会话时消息存在对应 key 上；请求走本地 mock，不依赖外网密钥。

x-sdk/x-conversations/with-x-chat

:::
