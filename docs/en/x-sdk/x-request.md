# XRequest

`XRequest(baseURL, options)` returns an instance with `run`, `abort` and `manual`. `baseURL` must be a non-empty string.

When handed to the Provider, `manual` must be `true`. Callbacks are written in `options.callbacks`: `onUpdate`, `onSuccess`, `onError`. `run(params)` merges these parameters with `options.params` and sends them out.

Responses are routed by `content-type`: `text/event-stream` goes to SSE, `application/json` goes to JSON. Other types throw unsupported content-type. You can also pass `timeout`, `streamTimeout`, `middlewares`, `transformStream`, custom separators, failure retries, and a custom `fetch`. SSE retries include the latest event id in `Last-Event-ID`.

### Basic usage

:::demo-v2 The button triggers a request. `fetch` is replaced with local SSE, and the page does not access the external network.

x-sdk/x-request/basic

:::

### Custom input

:::demo-v2 Attach custom fields such as `agentId` in `params`, still using the local mock.

x-sdk/x-request/custom-params

:::

### Custom transformer

:::demo-v2 `transformStream` + NDJSON mock sends the original chunks directly into `onUpdate`.

x-sdk/x-request/custom-transformer

:::

### Model integration

:::demo-v2 Manual mode with an input box. A mock OpenAI SSE stream can be aborted.

x-sdk/x-request/model

:::

### Timeout

:::demo-v2 `timeout: 2000`, the mock returns in 3000ms, triggering TimeoutError.

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

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| baseURL | API address | string | - | - |
| options | Request configuration | XRequestOptions\<Input, Output\> | - | - |

### XRequestOptions

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| callbacks | Request callbacks | XRequestCallbacks\<Output\> | - | - |
| params | Request parameters | Input | - | - |
| headers | Additional request headers | Record\<string, string\> | - | - |
| timeout | Request timeout (milliseconds) | number | - | - |
| streamTimeout | Stream data timeout (milliseconds) | number | - | - |
| fetch | Custom fetch | (baseURL, options) => Promise\<Response\> | - | - |
| middlewares | Pre- and post-request middleware | XFetchMiddlewares\<Input, Output\> | - | - |
| transformStream | Stream processor | XStreamOptions\<Output\>['transformStream'] | ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| streamSeparator | Stream event separator; ignored when `transformStream` is set | string | `\n\n` | 2.2.0 |
| partSeparator | Field separator inside one event; ignored when `transformStream` is set | string | `\n` | 2.2.0 |
| kvSeparator | Separator between field names and values; ignored when `transformStream` is set | string | `:` | 2.2.0 |
| manual | Whether to send the request manually; if `true`, `run` must be called | boolean | false | - |
| retryInterval | Retry interval after a failure, in milliseconds; disabled when omitted | number | - | - |
| retryTimes | Maximum retry count | number | - | - |

### XRequestCallbacks

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onSuccess | Success callback; receives the assembled message when used with a Chat Provider | (chunks: Output[], responseHeaders: Headers, message?: MessageInfo\<ChatMessage\>) => void | - | - |
| onError | Error callback; return a number to override the retry interval for this failure. With a Chat Provider it also receives the fallback message | (error: Error, errorInfo?: any, responseHeaders?: Headers, fallbackMsg?: MessageInfo\<ChatMessage\>) => number \| void | - | - |
| onUpdate | Chunk update callback; receives the assembled message when used with a Chat Provider | (chunk: Output, responseHeaders: Headers, message?: MessageInfo\<ChatMessage\>) => void | - | - |

### XRequestClass

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| run | Manually execute request (effective when `manual=true`) | (params?: Input) => void | - | - |
| isRequesting | Whether the request is in progress | boolean | - | - |
| manual | Whether it is manual mode | boolean | - | - |

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

The `new XRequest({ baseURL, model, dangerouslyApiKey }).create` in 1.x is now called `XRequestLegacy`, documentation at [XRequest Request](https://1x-ant-design-x-vue.netlify.app/component/x-request).
