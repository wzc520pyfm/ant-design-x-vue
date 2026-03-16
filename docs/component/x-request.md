
# XRequest 请求

## 何时使用

* 向符合 OpenAI 标准的 LLM 发起请求。

## 代码演示

### 基础

:::demo 该示例说明如何使用 XRequest 对符合 OpenAI 标准的 LLM 发起 fetch 请求 ，请拷贝代码且在 DEV 环境用实际的值替换 BASE_URL, PATH, MODEL, API_KEY 来使用。

x-request/basic

:::

### 自定义入参

:::demo 自定义 RequestParams，可以向智能体等发送消息。

x-request/request-params

:::

### 自定义转换器

:::demo 为 `XRequest` 配置自定义的 `transformStream`, 示例中使用 `application/x-ndjson` 数据演示。

x-request/custom-transformer

:::

### 变更配置

:::demo 控制变更`XRequestOptions`，动态修改配置项，如 baseURL、model 和 API key。

x-request/request-options

:::

### 模型接入

:::demo 接入云服务平台，可发送请求、终止消息。

x-request/model

:::

## API

### XRequestOptions

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| baseURL | API 请求的基础 URL | string | - | - |
| model | 模型名称，例如 'gpt-3.5-turbo' | string | - | - |
| dangerouslyApiKey | **注意: 🔥 `dangerouslyApiKey` 存在安全风险，对此有详细的[说明](/#)。** | string | - | - |
| fetch | 可选的自定义 fetch 函数，用于发起请求 | fetch | - | - |

### XRequestFunction

```ts
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  params: XRequestParams & Input,
  callbacks: XRequestCallbacks<Output>,
  transformStream?: XStreamOptions<Output>['transformStream'],
) => Promise<void>;
```

#### XRequestParams

| 属性     | 描述                                   | 类型                       | 默认值 | 版本 |
| -------- | -------------------------------------- | -------------------------- | ------ | ---- |
| model    | 生成响应时使用的模型。                 | string                     | -      | -    |
| messages | 消息对象数组，每个对象包含角色和内容。 | Record<PropertyKey, any>[] | -      | -    |
| stream   | 指示是否使用流式响应。                 | boolean                    | false  | -    |

#### XRequestCallbacks

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onSuccess | 成功时的回调。 | `(chunks: Output[]) => void` | - | - |
| onError | 错误处理的回调。 | `(error: Error) => void` | - | - |
| onUpdate | 消息更新的回调。 | `(chunk: Output) => void` | - | - |
| transformStream | 可选的转换函数，用于处理流数据 | `XStreamOptions<Output>['transformStream']` | - | - |
## 贡献者

<doc-contributors component-name="x-request" :max-count="50" :show-view-all="true" />
