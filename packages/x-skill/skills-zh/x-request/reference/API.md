# XRequest API (Vue)

```ts
import { XRequest, setXRequestGlobalOptions } from '@ant-design-x-vue/x-sdk'
import type { XRequestOptions, XRequestCallbacks } from '@ant-design-x-vue/x-sdk'
```

`XRequest(baseURL, options?) => XRequestClass`

### XRequestOptions

`callbacks`, `params`, `headers`, `timeout`, `streamTimeout`, `fetch`, `middlewares`, `transformStream`, `manual` (default `false`), plus standard `RequestInit` fields (`method`, `signal` is owned internally).

### XRequestClass

- `run(params?: Input): void` — only when `manual === true`
- `abort(): void`
- `isRequesting: boolean`
- `manual: boolean`

### XRequestCallbacks

- `onSuccess(chunks: Output[], responseHeaders: Headers)`
- `onError(error: Error)`
- `onUpdate(chunk: Output, responseHeaders: Headers)`
