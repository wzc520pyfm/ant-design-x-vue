
# useXChat 数据管理

配合 Agent hook 进行对话数据管理。

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

### 基本

:::demo 基础用法。

use-x-chat/basic

:::

### 流式输出

:::demo 使用流式输出更新内容。

use-x-chat/stream

:::

### 多项建议

:::demo 通过定制能力，返回多个推荐内容。

use-x-chat/suggestions

:::

### 模型接入

:::demo 接入云服务平台，可发送消息、处理数据、终止消息。

use-x-chat/model

:::

## API

```tsx | pure
type useXChat<AgentMessage, ParsedMessage = AgentMessage> = (
  config: XChatConfig<AgentMessage, ParsedMessage>,
) => XChatConfigReturnType;
```

### XChatConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| agent | 通过 `useXAgent` 生成的 `agent`，当使用 `onRequest` 方法时, `agent` 参数是必需的。 | XAgent | - |  |
| defaultMessages | 默认展示信息 | { status, message }[] | - |  |
| parser | 将 AgentMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 AgentMessage。支持将一条 AgentMessage 转换成多条 ParsedMessage | (message: AgentMessage) => BubbleMessage \| BubbleMessage[] | - |  |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | AgentMessage \| () => AgentMessage | - |  |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | AgentMessage \| () => AgentMessage | - |  |
| transformMessage | 可在更新数据时对`messages`做转换，同时会更新到`messages` | (info: {originMessage?: AgentMessage,currentMessage: any,status: MessageStatus}) => AgentMessage| - | - |
| transformStream | 可选的转换函数，用于处理流数据 | `XStreamOptions<Output>['transformStream']` | - | - |
| resolveAbortController | `AbortController` 控制器，用于控制流状态 | (abortController: AbortController) => void| - | - |

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| messages | 当前管理的内容 | AgentMessages[] |  |
| parsedMessages | 经过 `parser` 转译过的内容 | ParsedMessages[] |  |
| onRequest | 添加一条 Message，并且触发请求，若无`key`为`message`的数据则会将整个数据做为消息处理 | (requestParams: AgentMessage \| RequestParams) => void |  |
| setMessages | 直接修改 messages，不会触发请求 | (messages: { message, status }[]) => void |  |

### RequestParams

继承 [XRequestParams](https://antd-design-x-vue.netlify.app/component/x-request.html#xrequestparams)。

| 属性    | 说明           | 类型         | 默认值 | 版本 |
| ------- | -------------- | ------------ | ------ | ---- |
| message | 当前消息的内容 | AgentMessage | -      | -    |
