# useXAgent 模型调度

::: warning 1.x 页面
2.0 不再用 `useXAgent` 调度模型。该导出仅为旧示例保留。新代码使用 Chat Provider，见 [从 v1 到 v2](/development/migration-v2) 和 [SDK 数据流](/component/sdk-v2)。
:::

用于模型调度的 Agent 钩子。

## 何时使用

与后端模型进行交互，提供抽象数据流。

## 代码演示

### 预设请求

:::demo 我们将 XRequest 作为预设请求，仅需配置 `baseURL`、`model` 即可。

use-x-agent/preset

:::

### 自定义入参

:::demo 自定义 `RequestParams`，可以向智能体等发送消息。

use-x-agent/request-params

:::

### 自定义请求

:::demo 通过定制能力，返回多个推荐内容。

use-x-agent/custom

:::

### 模型接入

:::demo 接入云服务平台，可发送消息、转换流数据、终止消息。

use-x-agent/model

:::

### 变更配置

:::demo 控制变更`XRequestOptions`，动态修改配置项，如 baseURL、model 和 API key。

use-x-agent/request-options

:::

## API

```tsx | pure
type useXAgent<AgentMessage> = (
  config: XAgentConfigPreset | XAgentConfigCustom<AgentMessage>,
) => [Agent];
```

### XAgentConfigPreset

1.x 预设。`baseURL`、`model`，以及 `key` 或 `dangerouslyApiKey`，会交给旧的 `XRequestLegacy`。`key` 与 `dangerouslyApiKey` 等价，按原样放进 `Authorization`，不会自动加 `Bearer`。

2.0 的同一条接入路径是 [`createOpenAIChatProvider`](/component/x-sdk-chat-provider)。它创建 `OpenAIChatProvider`，请求为手动模式，裸 token 会写成 `Bearer <token>`。

<!-- todo: add dangerouslyApiKey desc link -->

| 属性              | 说明                                                                    | 类型   | 默认值 | 版本 |
| ----------------- | ----------------------------------------------------------------------- | ------ | ------ | ---- |
| baseURL           | 请求服务端地址                                                          | string | -      |      |
| key               | 请求秘钥                                                                | string | -      |      |
| model             | 协议模型                                                                | string | -      |      |
| dangerouslyApiKey | **注意: 🔥 `dangerouslyApiKey` 存在安全风险，对此有详细的[说明](/#)。** | string | -      | -    |

### XAgentConfigCustom

自定义请求协议。

| 属性    | 说明                         | 类型      | 默认值 | 版本 |
| ------- | ---------------------------- | --------- | ------ | ---- |
| request | 配置自定义请求，支持流式更新 | RequestFn |        |      |

#### RequestFn

更多请查看 [XStreamOptions](/component/x-stream#xstreamoptions)。

```tsx | pure
interface RequestFnInfo<Message> extends AnyObject {
  messages?: Message[];
  message?: Message;
}

export type RequestFn<Message, Input, Output> = (
  info: RequestFnInfo<Message, Input>,
  callbacks: {
    onUpdate: (chunk: Output) => void;
    onSuccess: (chunks: Output[]) => void;
    onError: (error: Error) => void;
    onStream?: (abortController: AbortController) => void;
  },
  transformStream?: XStreamOptions<Message>['transformStream'],
) => void;
```

### Agent

| 属性         | 说明                                                                                           | 类型          | 版本 |
| ------------ | ---------------------------------------------------------------------------------------------- | ------------- | ---- |
| request      | 调用 `useXAgent` 配置的请求，[详情](https://antd-design-x-vue.netlify.app/component/x-request) | RequestFn     |      |
| isRequesting | 是否正在请求                                                                                   | () => boolean |      |

## 贡献者

<doc-contributors component-name="use-x-agent" :max-count="50" :show-view-all="true" />
