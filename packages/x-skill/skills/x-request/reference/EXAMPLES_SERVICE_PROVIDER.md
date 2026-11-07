# XRequest + Provider

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design-x-vue/x-sdk'

export function createProvider() {
  return new OpenAIChatProvider({
    request: XRequest('/api/proxy/chat', {
      manual: true,
      timeout: 60_000,
      streamTimeout: 30_000,
    }),
  })
}
```

Standalone button:

```ts
const req = XRequest('/api/proxy/chat', {
  manual: true,
  callbacks: {
    onUpdate(chunk) { lines.value.push(chunk) },
    onError(err) { status.value = err.message },
  },
})

function send(text: string) {
  req.run({ query: text })
}
```
