---
name: x-request
version: 2.10.0
description: 讲解 @ant-design-x-vue/x-sdk 的 XRequest 配置：传输、鉴权、超时、流式解析，以及和 Provider 的配合。使用 Vue SDK API，不要用 React 包。
---

# 技能定位

正确配置 `XRequest`，适配各类流式 / JSON 接口。

# 最重要的差异（相对不少 React 示例）

`XRequest(baseURL, options)` 返回的是带 `run()` / `abort()` / `manual` 的**实例**，不能写成 `await XRequest(url)()`。

- 默认 `manual: false`：构造时就会发请求
- `manual: true`：必须调用 `run(params)`。**交给 Provider 时必须为 true**

```ts
import { XRequest } from '@ant-design-x-vue/x-sdk'

const request = XRequest('/api/proxy/chat', {
  manual: true,
  callbacks: {
    onUpdate(chunk) {},
    onSuccess(chunks, headers) {},
    onError(error) {},
  },
})
request.run({ query: 'hello' })
request.abort()
```

响应按 `content-type` 分流：`text/event-stream` 走 SSE，`application/json` 走 JSON。

# 安全

浏览器禁止直接配置 `Authorization: Bearer sk-...`，请走同源代理。Node 可用环境变量。

# 常用选项

`callbacks`、`params`、`headers`、`timeout`、`streamTimeout`、`fetch`、`middlewares`、`transformStream`、`manual`。

全局默认用 `setXRequestGlobalOptions`，不要在浏览器全局里放密钥。

# 开发规则

- Provider 场景必须 `manual: true`
- 从 `@ant-design-x-vue/x-sdk` 引入
- 用实例的 `run` / `abort`，不要把返回值当函数调用

# 参考

- [CORE.md](reference/CORE.md)
- [API.md](reference/API.md)
- [EXAMPLES_SERVICE_PROVIDER.md](reference/EXAMPLES_SERVICE_PROVIDER.md)
- https://x-vue.ant.design/x-sdk/x-request
