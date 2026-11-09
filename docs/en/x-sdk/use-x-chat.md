# useXChat

Manages the messages within a single conversation. A `provider` must be passed. Without a provider, `onRequest` and `abort` throw `provider is required`.

```ts
const {
  onRequest,
  onReload,
  abort,
  messages,
  parsedMessages,
  setMessages,
  setMessage,
  removeMessage,
  isRequesting,
  isDefaultMessagesRequesting,
  queueRequest,
} = useXChat({
  provider,
  conversationKey: activeConversationKey,
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: { role: 'assistant', content: 'failed' },
});
```

### Model integration

:::demo-v2 `createOpenAIChatProvider` + local SSE mock: input, streaming bubbles, cancel.

x-sdk/x-chat/model

:::

### Reasoning model integration

:::demo-v2 `DeepSeekChatProvider` parses `reasoning_content` with Think + XMarkdown (still a local mock).

x-sdk/x-chat/deepSeek

:::

### History messages

:::demo-v2 Prefill user/assistant history with `defaultMessages`, then continue.

x-sdk/x-chat/defaultMessages

:::

### System prompt

:::demo-v2 Use `role: 'developer'` as a system prompt; edit it on the page.

x-sdk/x-chat/developer

:::

### Custom request

:::demo-v2 `DefaultChatProvider` plus a custom `fetch` that returns JSON mock data.

x-sdk/x-chat/custom-request

:::

## API

### useXChat

```ts | pure
type useXChat<
  ChatMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => {
  onRequest: (requestParams: Partial<Input>, opts?: { extraInfo: AnyObject }) => void;
  onReload: (
    id: string | number,
    requestParams: Partial<Input>,
    opts?: { extraInfo: AnyObject },
  ) => void;
  abort: () => void;
  messages: Ref<MessageInfo<ChatMessage>[]>;
  parsedMessages: ComputedRef<MessageInfo<ParsedMessage>[]>;
  setMessages: (...args: Parameters<UseChatStoreReturn['setMessages']>) => void;
  setMessage: (...args: Parameters<UseChatStoreReturn['setMessage']>) => void;
  removeMessage: (id: string | number) => boolean;
  isRequesting: ComputedRef<boolean>;
  isDefaultMessagesRequesting: Ref<boolean>;
  queueRequest: (
    conversationKey: string | symbol,
    requestParams: Partial<Input>,
    opts?: { extraInfo: AnyObject },
  ) => void;
};
```

### XChatConfig

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider, converts data and requests of different structures into a format that can be consumed by useXChat. Built-in `DefaultChatProvider`, `OpenAIChatProvider`, or you can inherit `AbstractChatProvider` to implement it yourself. See [Chat Provider](/en/x-sdk/chat-provider) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| conversationKey | Conversation key; can be aligned with `activeConversationKey` of `useXConversations` to make each conversation independent message | ConversationData['key'] \| ShallowRef\<ConversationData['key'] \| undefined\> | - | - |
| defaultMessages | Display messages by default; support arrays, synchronous functions or asynchronous functions returning Promise (used to pull remote history) | DefaultMessageInfo\<ChatMessage\>[] \| ((info: { conversationKey?: string }) => DefaultMessageInfo\<ChatMessage\>[] \| Promise\<DefaultMessageInfo\<ChatMessage\>[]\>) | - | - |
| parser | Convert ChatMessage to ParsedMessage; if not set, consume ChatMessage directly. Support one-to-many | (message: ChatMessage) => ParsedMessage \| ParsedMessage[] | - | - |
| requestFallback | A cryptic message when the request fails; if not provided, the cryptic message will not be displayed | ChatMessage \| ((requestParams: Partial\<Input\>, info: { error: Error; messages: ChatMessage[]; messageInfo: MessageInfo\<ChatMessage\> }) => ChatMessage \| Promise\<ChatMessage\>) | - | - |
| requestPlaceholder | The placeholder message in the request; if not provided, the placeholder will not be displayed | ChatMessage \| ((requestParams: Partial\<Input\>, info: { messages: ChatMessage[] }) => ChatMessage) | - | - |

### Return

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether requesting (computed) | ComputedRef\<boolean\> | - | - |
| isDefaultMessagesRequesting | Whether the default message list is in the request (asynchronous `defaultMessages`) | Ref\<boolean\> | false | - |
| messages | Currently managed message list | Ref\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parsedMessages | List converted by `parser` | ComputedRef\<MessageInfo\<ParsedMessage\>[]\> | - | - |
| onReload | Replay by message id, send a request to the backend and update the message with the returned data | (id: string \| number, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| onRequest | Append messages and trigger requests | (requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| setMessages | Directly modify the message list without triggering a request | (messages \| updater) => void | - | - |
| setMessage | Directly modify a single message without triggering a request | (id, info \| updater) => void | - | - |
| removeMessage | Delete a single message without triggering a request | (id: string \| number) => boolean | - | - |
| queueRequest | Add the request to the queue and wait for the current session `defaultMessages` to be initialized before sending | (conversationKey: string \| symbol, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |

#### MessageInfo

```ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extraInfo?: AnyObject;
}
```

#### MessageStatus

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```

`useXChat({ agent })` in 1.x is now called `useLegacyXChat`, and the documentation is in [useXChat Data Management](https://1x-ant-design-x-vue.netlify.app/component/use-x-chat).
