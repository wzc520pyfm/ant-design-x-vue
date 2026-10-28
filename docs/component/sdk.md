# SDK 数据流

2.0 的会话数据从 `ant-design-x-vue` 导出，实现在 `@ant-design-x-vue/x-sdk`。Markdown 渲染仍从 `@ant-design-x-vue/x-markdown` 引入。

从 1.x 迁过来时先看 [从 v1 到 v2](/development/migration-v2)。下面几页按 React 2.0 的 x-sdk 目录拆开：

- [介绍](/component/x-sdk-introduce)
- [Chat Provider](/component/x-sdk-chat-provider)
- [useXChat](/component/x-sdk-use-x-chat)
- [useXConversations](/component/x-sdk-use-x-conversations)
- [XRequest](/component/x-sdk-x-request)
- [XStream](/component/x-sdk-x-stream)

## useXConversations

管理会话列表和当前会话。`conversations` 与 `activeConversationKey` 是 shallowRef。

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

`provider` 负责发请求和把流式 chunk 转成消息。`conversationKey` 可以是字符串，也可以是 `useXConversations` 返回的 `activeConversationKey`。

| 返回值                   | 说明                                                      |
| ------------------------ | --------------------------------------------------------- |
| onRequest                | 发起一轮请求。未传 provider 时抛出 `provider is required` |
| onReload                 | 按消息 id 重放                                            |
| abort                    | 中止当前请求                                              |
| messages                 | 原始消息列表                                              |
| parsedMessages           | 经过 `parser` 之后、供气泡使用的列表                      |
| setMessages / setMessage | 改写列表或单条消息                                        |
| isRequesting             | 是否有进行中的请求，computed                              |

消息状态：`local`、`loading`、`updating`、`success`、`error`、`abort`。

## Chat Provider

`OpenAIChatProvider` 和 `DeepSeekChatProvider` 面向兼容 Chat Completions 的接口。`DefaultChatProvider` 用于自定义输出。请求实例必须是手动模式：

```ts
const provider = new OpenAIChatProvider({
  request: XRequest('https://api.example.com/v1/chat/completions', {
    manual: true,
    headers: { Authorization: 'Bearer YOUR_KEY' },
  }),
});
```

`manual` 不是 `true` 时，Provider 构造会抛出 `request must be manual`。

`createOpenAIChatProvider({ baseURL, model, dangerouslyApiKey })` 把上面两步收成一次调用。裸 token 会变成 `Authorization: Bearer <token>`。已经带 `Bearer `、`Basic ` 或 `Tbox-` 前缀的值保持原样。`key` 是 `dangerouslyApiKey` 的别名。

## XRequest 与 XStream

`XRequest(baseURL, options)` 返回带 `run`、`abort`、`manual` 的实例。`baseURL` 必须是非空字符串。

`XStream({ readableStream, transformStream })` 把 `ReadableStream<Uint8Array>` 转成可异步迭代的 SSE 记录。不传 `transformStream` 时按 SSE 字段拆分。

## 相关导出

同一入口还导出 `AbstractChatProvider`、`DefaultChatProvider`、`XMCPClient`、`useChatStore`。包版本号分别在两个子包里，主包不再导出名为 `version` 的绑定，避免 SDK 和 Markdown 同名导出叠在一起。
