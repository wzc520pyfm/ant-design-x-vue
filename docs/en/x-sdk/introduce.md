# Introduction

`@ant-design-x-vue/x-sdk` provides the 2.10 conversation data flow, and the main package `ant-design-x-vue` re-exports the same set of APIs.

- `useXConversations` manages the conversation list
- `useXChat` manages the messages, status, and retries of a single conversation
- `XRequest` sends requests, supporting manual mode, middleware, and SSE
- `OpenAIChatProvider`, `DeepSeekChatProvider`, `DefaultChatProvider` unify model responses into messages
- Multiple conversations each have their own messages, separated by conversation key

```bash
pnpm add ant-design-x-vue@2.10.0
```

The main package includes the same version of `@ant-design-x-vue/x-sdk`. When installing only the SDK:

```bash
pnpm add @ant-design-x-vue/x-sdk@2.10.0
```

```ts
import {
  createOpenAIChatProvider,
  useXChat,
  useXConversations,
  XRequest,
  XStream,
} from 'ant-design-x-vue';
```

Pages:

- [Chat Provider](/en/x-sdk/chat-provider)
- [useXChat](/en/x-sdk/use-x-chat)
- [useXConversations](/en/x-sdk/use-x-conversations)
- [XRequest](/en/x-sdk/x-request)
- [XStream](/en/x-sdk/x-stream)

1.x `useXAgent` is still in the main package, only serving old examples. Field descriptions can be found in [SDK Data Flow](/en/x-sdk/data-flow).
