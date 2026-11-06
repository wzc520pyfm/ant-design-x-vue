---
name: x-chat-provider
version: 2.0.0
description: Implement a Vue-oriented Chat Provider that adapts any streaming API to @ant-design-x-vue/x-sdk. Do not emit React packages or JSX.
---

# Skill Positioning

**One job**: adapt your streaming API to an Ant Design X Vue Chat Provider.

**Out of scope**: `useXChat` usage (see `use-x-chat`).

# Package map

| Layer | Package |
| --- | --- |
| UI | `ant-design-x-vue` |
| Logic | `@ant-design-x-vue/x-sdk` |
| Markdown | `@ant-design-x-vue/x-markdown` |

```ts
import { Bubble } from 'ant-design-x-vue'
import {
  AbstractChatProvider,
  OpenAIChatProvider,
  DeepSeekChatProvider,
  DefaultChatProvider,
  createOpenAIChatProvider,
  XRequest,
} from '@ant-design-x-vue/x-sdk'
import type { TransformMessage, XRequestOptions } from '@ant-design-x-vue/x-sdk'
```

# Provider decision tree

1. Standard OpenAI Chat Completions → `createOpenAIChatProvider` or `new OpenAIChatProvider`
2. DeepSeek (includes `reasoning_content`) → `DeepSeekChatProvider`
3. Response is already the shape you want to display → `DefaultChatProvider` (pass-through; render with `contentRender`)
4. Anything else → extend `AbstractChatProvider` (three methods)

Vue-only note: `createOpenAIChatProvider({ baseURL, model, dangerouslyApiKey | key, fetch })` keeps the 1.x `useXAgent` preset header shape. Prefer a proxy `fetch`; do not embed secrets in the browser. Tokens are sent as `Bearer <token>` unless they already start with `Bearer `, `Basic `, or `Tbox-`.

# Four steps for a custom Provider

## 1. Record the API

URL, method (usually JSON POST), SSE vs JSON, auth (proxy on the browser).

## 2. Implement three methods only

```ts
import { AbstractChatProvider } from '@ant-design-x-vue/x-sdk'
import type { TransformMessage, XRequestOptions } from '@ant-design-x-vue/x-sdk'

interface MyInput {
  query: string
  model?: string
  stream?: boolean
}

interface MyOutput {
  content: string
  finish_reason?: string
}

interface MyMessage {
  content: string
  role: 'user' | 'assistant'
}

export class MyChatProvider extends AbstractChatProvider<MyMessage, MyInput, MyOutput> {
  transformParams(
    requestParams: Partial<MyInput>,
    options: XRequestOptions<MyInput, MyOutput, MyMessage>,
  ): MyInput {
    return {
      ...(options?.params || {}),
      query: requestParams.query || '',
      model: 'gpt-3.5-turbo',
      stream: true,
    }
  }

  transformLocalMessage(requestParams: Partial<MyInput>): MyMessage {
    return {
      content: requestParams.query || '',
      role: 'user',
    }
  }

  // Return only MyMessage — do NOT add a status field (status lives on MessageInfo).
  transformMessage(info: TransformMessage<MyMessage, MyOutput>): MyMessage {
    const { originMessage, chunk } = info
    if (!chunk?.content || chunk.content === '[DONE]') {
      return { ...(originMessage || { content: '', role: 'assistant' }) }
    }
    return {
      content: `${originMessage?.content || ''}${chunk.content}`,
      role: 'assistant',
    }
  }
}
```

`transformMessage` receives `{ originMessage, chunk, chunks, status, responseHeaders }`. Accumulate with `originMessage`.

## 3. Checklist

- Only those three methods (no custom `request()`)
- `transformParams` has the second `options` argument
- Return value has no `status`
- `tsc --noEmit` is clean

## 4. Instantiate with manual XRequest

```ts
import { MyChatProvider } from './MyChatProvider'
import { XRequest } from '@ant-design-x-vue/x-sdk'

const provider = new MyChatProvider({
  request: XRequest('https://your-api.com/chat', {
    manual: true,
    params: { stream: true },
  }),
})
```

`XRequest(url, options)` returns an **instance** (`run`, `abort`, `manual`). The Provider calls `run` internally. Do not write `await XRequest(...)()`.

# DefaultChatProvider

Pass-through: `ChatMessage` is typically your `Output` (or a union). Render with `Bubble.List` `roles.*.contentRender`.

```ts
const provider = new DefaultChatProvider<ChatOutput | ChatInput, ChatInput, ChatOutput>({
  request: XRequest('https://your-api.com/chat', {
    manual: true,
    params: { stream: false },
  }),
})
```

# XRequest extras (when adapting APIs)

- `callbacks`: `onUpdate` / `onSuccess` / `onError`
- `timeout` / `streamTimeout`
- `transformStream` for non-SSE (e.g. NDJSON)
- `fetch` to inject mocks or a proxy
- `middlewares`
- `setXRequestGlobalOptions` for shared headers (never put secrets in browser globals)

# Development rules

- Always `manual: true` on Provider requests
- Import from `@ant-design-x-vue/x-sdk`, not `@ant-design/x-sdk`
- Do not implement HTTP inside `transformMessage`
- Built-in names: `OpenAIChatProvider`, `DeepSeekChatProvider`, `DefaultChatProvider`, `createOpenAIChatProvider`

# Reference

- [EXAMPLES.md](reference/EXAMPLES.md)
- https://x-vue.ant.design/x-sdk/chat-provider
