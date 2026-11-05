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

## API

### useXConversations

```ts | pure
type useXConversations = (config?: XConversationConfig) => {
  conversations: ShallowRef<ConversationData[]>;
  activeConversationKey: ShallowRef<string>;
  setActiveConversationKey: (key: string) => boolean;
  addConversation: (conversation: ConversationData, placement?: 'prepend' | 'append') => boolean;
  removeConversation: (key: string) => boolean;
  setConversation: (key: string, conversation: ConversationData) => boolean;
  getConversation: (key: string) => ConversationData | undefined;
  setConversations: (conversations: ConversationData[]) => boolean;
  getMessages: (conversationKey: string) => unknown;
};
```

### XConversationConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultConversations | 默认会话列表 | ConversationData[] | `[]` | - |
| defaultActiveConversationKey | 默认当前会话 key | string | `''` | - |

### ConversationData

```ts | pure
interface ConversationData extends AnyObject {
  key: string;
  label?: string;
}
```

### Return

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| conversations | 会话列表（shallowRef） | ShallowRef\<ConversationData[]\> | - | - |
| activeConversationKey | 当前会话 key（shallowRef） | ShallowRef\<string\> | - | - |
| setActiveConversationKey | 切换当前会话 | (key: string) => boolean | - | - |
| addConversation | 新增会话 | (conversation: ConversationData, placement?: 'prepend' \| 'append') => boolean | - | - |
| removeConversation | 删除会话 | (key: string) => boolean | - | - |
| setConversation | 更新单个会话 | (key: string, conversation: ConversationData) => boolean | - | - |
| getConversation | 按 key 读取会话 | (key: string) => ConversationData \| undefined | - | - |
| setConversations | 整体替换会话列表 | (conversations: ConversationData[]) => boolean | - | - |
| getMessages | 按会话 key 读取消息快照 | (conversationKey: string) => unknown | - | - |
