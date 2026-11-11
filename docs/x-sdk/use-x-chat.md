# useXChat

管理一轮会话里的消息。必须传入 `provider`。没有 provider 时，`onRequest` 和 `abort` 抛出 `provider is required`。

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

### 模型接入

:::demo-v2 `createOpenAIChatProvider` + 本地 SSE mock：输入、流式气泡、取消。

x-sdk/x-chat/model

:::

### 思考模型接入

:::demo-v2 `DeepSeekChatProvider` 解析 `reasoning_content`，配合 Think + XMarkdown；仍走本地 mock。

x-sdk/x-chat/deepSeek

:::

### 历史消息设置

:::demo-v2 `defaultMessages` 预填用户与助手历史，再继续对话。

x-sdk/x-chat/defaultMessages

:::

### 系统提示词设置

:::demo-v2 `role: 'developer'` 作为系统提示，可在页面上修改。

x-sdk/x-chat/developer

:::

### 自定义 request

:::demo-v2 `DefaultChatProvider` + 自定义 `fetch`，返回 JSON mock。

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

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| provider | 数据提供者，将不同结构的数据与请求转换为 useXChat 可消费的格式。内置 `DefaultChatProvider`、`OpenAIChatProvider`，也可继承 `AbstractChatProvider` 自行实现。见 [Chat Provider](/x-sdk/chat-provider) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| conversationKey | 会话 key；可与 `useXConversations` 的 `activeConversationKey` 对齐，使每个会话独立消息 | ConversationData['key'] \| ShallowRef\<ConversationData['key'] \| undefined\> | - | - |
| defaultMessages | 默认展示消息；支持数组、同步函数或返回 Promise 的异步函数（用于拉取远程历史） | DefaultMessageInfo\<ChatMessage\>[] \| ((info: { conversationKey?: string }) => DefaultMessageInfo\<ChatMessage\>[] \| Promise\<DefaultMessageInfo\<ChatMessage\>[]\>) | - | - |
| parser | 将 ChatMessage 转为 ParsedMessage；未设置时直接消费 ChatMessage。支持一对多 | (message: ChatMessage) => ParsedMessage \| ParsedMessage[] | - | - |
| requestFallback | 请求失败时的兜底消息；未提供则不展示兜底 | ChatMessage \| ((requestParams: Partial\<Input\>, info: { error: Error; messages: ChatMessage[]; messageInfo: MessageInfo\<ChatMessage\> }) => ChatMessage \| Promise\<ChatMessage\>) | - | - |
| requestPlaceholder | 请求中的占位消息；未提供则不展示占位 | ChatMessage \| ((requestParams: Partial\<Input\>, info: { messages: ChatMessage[] }) => ChatMessage) | - | - |

### Return

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| abort | 取消请求 | () => void | - | - |
| isRequesting | 是否正在请求（computed） | ComputedRef\<boolean\> | - | - |
| isDefaultMessagesRequesting | 默认消息列表是否在请求中（异步 `defaultMessages`） | Ref\<boolean\> | false | - |
| messages | 当前管理的消息列表 | Ref\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parsedMessages | 经过 `parser` 转换后的列表 | ComputedRef\<MessageInfo\<ParsedMessage\>[]\> | - | - |
| onReload | 按消息 id 重放，向后端发请求并用返回数据更新该消息 | (id: string \| number, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| onRequest | 追加消息并触发请求 | (requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| setMessages | 直接修改消息列表，不触发请求 | (messages \| updater) => void | - | - |
| setMessage | 直接修改单条消息，不触发请求 | (id, info \| updater) => void | - | - |
| removeMessage | 删除单条消息，不触发请求 | (id: string \| number) => boolean | - | - |
| queueRequest | 将请求加入队列，等待当前会话 `defaultMessages` 初始化完成后再发送 | (conversationKey: string \| symbol, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |

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

1.x 的 `useXChat({ agent })` 现在叫 `useLegacyXChat`，文档在 [useXChat 数据管理](https://1x-ant-design-x-vue.netlify.app/component/use-x-chat)。
