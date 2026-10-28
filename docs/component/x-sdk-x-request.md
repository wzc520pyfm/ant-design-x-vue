# XRequest

`XRequest(baseURL, options)` 返回带 `run`、`abort`、`manual` 的实例。`baseURL` 必须是非空字符串。

交给 Provider 时 `manual` 必须为 `true`。回调写在 `options.callbacks`：`onUpdate`、`onSuccess`、`onError`。`run(params)` 把这次参数和 `options.params` 合并后发出去。

响应按 `content-type` 分流：`text/event-stream` 走 SSE，`application/json` 走 JSON。其它类型抛出不支持的 content-type。还可以传 `timeout`、`streamTimeout`、`middlewares`、`transformStream` 和自定义 `fetch`。

:::demo-v2 按钮触发一次手动请求。fetch 被换成本地 SSE，页面不会访问外网。

x-sdk/x-request

:::

1.x 的 `new XRequest({ baseURL, model, dangerouslyApiKey }).create` 现在叫 `XRequestLegacy`，文档在 [XRequest 请求 (1.x)](/component/x-request)。
