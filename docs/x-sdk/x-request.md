# XRequest

`XRequest(baseURL, options)` 返回带 `run`、`abort`、`manual` 的实例。`baseURL` 必须是非空字符串。

交给 Provider 时 `manual` 必须为 `true`。回调写在 `options.callbacks`：`onUpdate`、`onSuccess`、`onError`。`run(params)` 把这次参数和 `options.params` 合并后发出去。

响应按 `content-type` 分流：`text/event-stream` 走 SSE，`application/json` 走 JSON。其它类型抛出不支持的 content-type。还可以传 `timeout`、`streamTimeout`、`middlewares`、`transformStream` 和自定义 `fetch`。

### 基础使用

:::demo-v2 按钮触发一次请求。`fetch` 被换成本地 SSE，页面不会访问外网。

x-sdk/x-request/basic

:::

### 自定义入参

:::demo-v2 在 `params` 里附带 `agentId` 等自定义字段，仍然走本地 mock。

x-sdk/x-request/custom-params

:::

### 自定义转换器

:::demo-v2 `transformStream` + NDJSON mock，把原始分片原样送进 `onUpdate`。

x-sdk/x-request/custom-transformer

:::

### 模型接入

:::demo-v2 手动模式 + 输入框，用 mock OpenAI SSE 模拟模型流式回复，可 Abort。

x-sdk/x-request/model

:::

### 超时配置

:::demo-v2 `timeout: 2000`，mock 在 3000ms 才返回，触发 TimeoutError。

x-sdk/x-request/timeout

:::

## API

### XRequestFunction

```ts | pure
type XRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  baseURL: string,
  options?: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;
```

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| baseURL | API 地址 | string | - | - |
| options | 请求配置 | XRequestOptions\<Input, Output\> | - | - |

### XRequestOptions

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| callbacks | 请求回调 | XRequestCallbacks\<Output\> | - | - |
| params | 请求参数 | Input | - | - |
| headers | 额外请求头 | Record\<string, string\> | - | - |
| timeout | 请求超时（毫秒） | number | - | - |
| streamTimeout | 流式数据超时（毫秒） | number | - | - |
| fetch | 自定义 fetch | (baseURL, options) => Promise\<Response\> | - | - |
| middlewares | 请求前后中间件 | XFetchMiddlewares\<Input, Output\> | - | - |
| transformStream | 流处理器 | XStreamOptions\<Output\>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| manual | 是否手动发请求；为 `true` 时需调用 `run` | boolean | false | - |

### XRequestCallbacks

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onSuccess | 成功回调 | (chunks: Output[], responseHeaders: Headers) => void | - | - |
| onError | 错误回调 | (error: Error) => void | - | - |
| onUpdate | 分片更新回调 | (chunk: Output, responseHeaders: Headers) => void | - | - |

### XRequestClass

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| abort | 取消请求 | () => void | - | - |
| run | 手动执行请求（`manual=true` 时生效） | (params?: Input) => void | - | - |
| isRequesting | 是否正在请求 | boolean | - | - |
| manual | 是否手动模式 | boolean | - | - |

### setXRequestGlobalOptions

```ts | pure
type setXRequestGlobalOptions<Input, Output> = (
  options: XRequestGlobalOptions<Input, Output>,
) => void;
```

### XRequestGlobalOptions

```ts | pure
type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream' | 'manual'
>;
```

### XFetchMiddlewares

```ts | pure
interface XFetchMiddlewares<Input, Output> {
  onRequest?: (
    ...args: [Parameters<typeof fetch>[0], XRequestOptions<Input, Output>]
  ) => Promise<[Parameters<typeof fetch>[0], XRequestOptions<Input, Output>]>;
  onResponse?: (response: Response) => Promise<Response>;
}
```

1.x 的 `new XRequest({ baseURL, model, dangerouslyApiKey }).create` 现在叫 `XRequestLegacy`，文档在 [XRequest 请求](https://antd-design-x-vue.netlify.app/component/x-request)。
