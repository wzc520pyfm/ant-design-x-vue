# SDK data flow

In version 2.0, conversation data is exported from `ant-design-x-vue`, implemented in `@ant-design-x-vue/x-sdk`. Markdown rendering is still imported from `@ant-design-x-vue/x-markdown`.

When migrating from 1.x, first see [From v1 to v2](/en/development/migration-v2). The following pages are split by the x-sdk directory of React 2.0:

- [Introduction](/en/x-sdk/introduce)
- [Chat Provider](/en/x-sdk/chat-provider)
- [useXChat](/en/x-sdk/use-x-chat)
- [useXConversations](/en/x-sdk/use-x-conversations)
- [XRequest](/en/x-sdk/x-request)
- [XStream](/en/x-sdk/x-stream)

## useXConversations

Manage the conversation list and the current conversation. `conversations` and `activeConversationKey` are shallowRef.

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
  defaultConversations: [{ key: '1', label: '新对话' }],
  defaultActiveConversationKey: '1',
});
```

## useXChat

`provider` is responsible for sending requests and converting streamed chunks into messages. `conversationKey` can be a string or the `activeConversationKey` returned by `useXConversations`.

| Return Value              | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| onRequest                 | Initiates a request cycle. Throws `provider is required` if provider is not passed |
| onReload | Replay by message id |
| abort | Abort the current request |
| messages | original message list |
| parsedMessages | List for bubbles after `parser` |
| setMessages / setMessage | Rewrite a list or a single message |
| isRequesting | Whether there is an ongoing request, computed |

Message status: `local`, `loading`, `updating`, `success`, `error`, `abort`.

## Chat Provider

`OpenAIChatProvider` and `DeepSeekChatProvider` are for interfaces compatible with Chat Completions. `DefaultChatProvider` is used for custom output. The request instance must be in manual mode:

```ts
const provider = new OpenAIChatProvider({
  request: XRequest('https://api.example.com/v1/chat/completions', {
    manual: true,
    headers: { Authorization: 'Bearer YOUR_KEY' },
  }),
});
```

When `manual` is not `true`, the Provider constructor will throw `request must be manual`.

`createOpenAIChatProvider({ baseURL, model, dangerouslyApiKey })` combines the above two steps into one call. The bare token will become `Authorization: Bearer <token>`. Values ​​already prefixed with `Bearer`, `Basic` or `Tbox-` remain intact. `key` is an alias for `dangerouslyApiKey`.

## XRequest and XStream

`XRequest(baseURL, options)` returns an instance with `run`, `abort` and `manual`. `baseURL` must be a non-empty string.

`XStream({ readableStream, transformStream })` converts `ReadableStream\<Uint8Array>` into an SSE record that can be iterated asynchronously. Split by SSE field when `transformStream` is not passed.

## Related exports

The same entry also exports `AbstractChatProvider`, `DefaultChatProvider`, `XMCPClient`, and `useChatStore`. The package version numbers are in the two sub-packages, and the main package no longer exports a binding named `version` to avoid the SDK and Markdown exports with the same name overlapping.
