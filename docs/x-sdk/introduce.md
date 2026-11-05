# 介绍

`@ant-design-x-vue/x-sdk` 提供 2.0 的会话数据流，主包 `ant-design-x-vue` 再导出同一套 API。

- `useXConversations` 管会话列表
- `useXChat` 管一轮对话的消息、状态和重试
- `XRequest` 发请求，支持手动模式、中间件和 SSE
- `OpenAIChatProvider`、`DeepSeekChatProvider`、`DefaultChatProvider` 把模型响应收成统一消息
- 多个会话各自一份消息，用会话 key 隔开

```bash
pnpm add ant-design-x-vue@2.0.0
```

主包会带上同版本的 `@ant-design-x-vue/x-sdk`。只装 SDK 时：

```bash
pnpm add @ant-design-x-vue/x-sdk@2.0.0
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

页面：

- [Chat Provider](/x-sdk/chat-provider)
- [useXChat](/x-sdk/use-x-chat)
- [useXConversations](/x-sdk/use-x-conversations)
- [XRequest](/x-sdk/x-request)
- [XStream](/x-sdk/x-stream)

1.x 的 `useXAgent` 仍在主包里，只服务旧示例。字段说明见 [SDK 数据流](/x-sdk/data-flow)。
