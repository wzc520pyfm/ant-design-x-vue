# useXChat API (Vue)

Source of truth: `docs/x-sdk/use-x-chat.md` and `packages/x-sdk/src/x-chat`.

## Import

```ts
import { useXChat, useXConversations } from '@ant-design-x-vue/x-sdk'
```

`useXChat` is also re-exported from `ant-design-x-vue`, but prefer the SDK package in generated code.

## Config

| Option | Notes |
| --- | --- |
| `provider` | Required `AbstractChatProvider` |
| `conversationKey` | `string` or `ShallowRef` |
| `defaultMessages` | Array, sync function, or async function `({ conversationKey }) => ...` |
| `parser` | `(message) => Parsed \| Parsed[]` |
| `requestFallback` | Static message or function ` (params, { error, messages, messageInfo })` |
| `requestPlaceholder` | Static message or function `(params, { messages })` |

Without `provider`, `onRequest` and `abort` throw `provider is required`.

## Returns

All list/flag values are Vue refs or computed refs:

- `messages: Ref<MessageInfo<ChatMessage>[]>`
- `parsedMessages: ComputedRef<MessageInfo<ParsedMessage>[]>`
- `isRequesting: ComputedRef<boolean>`
- `isDefaultMessagesRequesting: Ref<boolean>`
- `onRequest(requestParams, opts?: { extraInfo })`
- `onReload(id, requestParams, opts?)`
- `abort()`
- `setMessages` / `setMessage` / `removeMessage`
- `queueRequest(conversationKey, requestParams, opts?)`

## MessageInfo

```ts
interface MessageInfo<ChatMessage> {
  id: number | string
  message: ChatMessage
  status: 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort'
  extraInfo?: Record<PropertyKey, any>
}
```

1.x `useXChat({ agent })` is now `useLegacyXChat` (legacy docs only). Do not generate `agent` for 2.x Vue apps.

## useXConversations

```ts
const {
  conversations,              // ShallowRef<ConversationData[]>
  activeConversationKey,      // ShallowRef<string>
  setActiveConversationKey,   // (key) => boolean
  addConversation,            // (data, 'prepend' | 'append') => boolean
  removeConversation,
  setConversation,
  setConversations,
  getConversation,
  getMessages,
} = useXConversations({
  defaultConversations: [{ key: '1', label: 'New chat' }],
  defaultActiveConversationKey: '1',
})
```

A conversation object must include `key`. Pass `activeConversationKey` into `useXChat({ conversationKey })`.
