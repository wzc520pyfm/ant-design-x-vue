---
name: x-request
version: 2.0.0
description: Configure XRequest from @ant-design-x-vue/x-sdk — transport, auth, retries/timeouts, streaming, and Provider integration. Vue SDK APIs, not React.
---

# Skill Positioning

How to configure `XRequest` for streaming and JSON APIs in Vue apps.

# Install

```bash
npm install @ant-design-x-vue/x-sdk
```

# Basic usage

`XRequest(baseURL, options)` returns an **instance** with `run()`, `abort()`, `manual`, `isRequesting`. `baseURL` must be a non-empty string.

- `manual: false` (default): the request starts in the constructor.
- `manual: true`: you (or a Provider) must call `run(params)`. **Providers require `manual: true`.**

```ts
import { XRequest } from '@ant-design-x-vue/x-sdk'

// Immediate request (standalone demo)
const auto = XRequest('https://api.example.com/chat', {
  params: { query: 'hello' },
  callbacks: {
    onUpdate(chunk) { /* SSE or JSON chunk */ },
    onSuccess(chunks, headers) {},
    onError(error) {},
  },
})

// Manual (Provider / button-triggered)
const request = XRequest('https://api.example.com/chat', {
  manual: true,
  params: { stream: true },
  callbacks: {
    onUpdate(chunk) {},
    onSuccess(chunks) {},
    onError(err) {},
  },
})
request.run({ query: 'hello' })
request.abort()
```

Do **not** write `await XRequest(url)()` — the Vue helper is not a thunk that returns a Promise. Use `callbacks` or follow `request.asyncHandler` if you need the internal promise.

Responses: `text/event-stream` → SSE; `application/json` → JSON. Other content types throw.

# Options

| Option | Meaning |
| --- | --- |
| `callbacks` | `onUpdate(chunk, headers)`, `onSuccess(chunks, headers)`, `onError(error)` |
| `params` | Default body fields; merged with `run(params)` |
| `headers` | Extra headers (never put API keys in browser bundles) |
| `timeout` | Overall timeout (ms) → `TimeoutError` |
| `streamTimeout` | Idle timeout while streaming (ms) |
| `fetch` | Custom fetch (mocks, proxies) |
| `middlewares` | `XFetchMiddlewares` around the request |
| `transformStream` | Custom stream parser (NDJSON, etc.) |
| `manual` | Default `false` |

Defaults: `method: 'POST'`, JSON body from `params`.

`setXRequestGlobalOptions({ headers, ... })` applies shared options. Do not store secrets there in the browser.

# Security

| Environment | How to authenticate |
| --- | --- |
| Browser | Same-origin proxy only. **No** `Authorization: Bearer sk-...` in frontend code |
| Node.js | `process.env` keys are OK |
| Proxy | Forward the secret server-side |

```ts
// Browser
const request = XRequest('/api/proxy/chat', { manual: true })

// Node
const request = XRequest('https://api.example.com/chat', {
  manual: true,
  headers: { Authorization: `Bearer ${process.env.API_KEY}` },
})
```

# Integration

- With Providers: `new OpenAIChatProvider({ request: XRequest(url, { manual: true }) })`
- Standalone streaming UIs: `manual: true` + button → `run()` + `onUpdate` to fill local state
- See `x-chat-provider` and `use-x-chat` for the full conversation stack

# Development rules

- Provider usage ⇒ `manual: true`
- Import `@ant-design-x-vue/x-sdk`, not `@ant-design/x-sdk`
- Call `run()` / `abort()` on the instance
- Never leak keys in browser headers

# Reference

- [CORE.md](reference/CORE.md)
- [API.md](reference/API.md)
- [EXAMPLES_SERVICE_PROVIDER.md](reference/EXAMPLES_SERVICE_PROVIDER.md)
- https://x-vue.ant.design/x-sdk/x-request
