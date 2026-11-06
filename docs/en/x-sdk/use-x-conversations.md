# useXConversations

Manage session list and current session. `conversations` and `activeConversationKey` are shallowRef, and after matching with `conversationKey` of `useXChat`, each conversation has its own message.

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

`addConversation(conversation, 'prepend' | 'append')`. The conversation object must have at least a `key`.

### Basic usage

:::demo-v2 Uses `useXConversations` to drive the conversation list.

x-sdk/x-conversations/basic

:::

### Conversation actions

:::demo-v2 Create, update, reset, and delete from the menu.

x-sdk/x-conversations/operations

:::

### Multiple instances

:::demo-v2 Two independent `useXConversations` instances do not affect each other.

x-sdk/x-conversations/multi-instances

:::

### Use with useXChat

:::demo-v2 Messages stay under each conversation key; requests use a local mock, not an external API key.

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

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultConversations | Default conversation list | ConversationData[] | `[]` | - |
| defaultActiveConversationKey | Default current conversation key | string | `''` | - |

### ConversationData

```ts | pure
interface ConversationData extends AnyObject {
  key: string;
  label?: string;
}
```

### Return

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| conversations | Conversation list (shallowRef) | ShallowRef\<ConversationData[]\> | - | - |
| activeConversationKey | Current conversation key (shallowRef) | ShallowRef\<string\> | - | - |
| setActiveConversationKey | Switch current conversation | (key: string) => boolean | - | - |
| addConversation | Add a new conversation | (conversation: ConversationData, placement?: 'prepend' | 'append') => boolean | - | - |
| removeConversation | Remove a conversation | (key: string) => boolean | - | - |
| setConversation | Update a single conversation | (key: string, conversation: ConversationData) => boolean | - | - |
| getConversation | Get a conversation by key | (key: string) => ConversationData | undefined | - | - |
| setConversations | Replace the entire conversation list | (conversations: ConversationData[]) => boolean | - | - |
| getMessages | Read message snapshots by conversation key | (conversationKey: string) => unknown | - | - |
