# useXChat examples (Vue)

## OpenAI preset + Bubble / Sender

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { createOpenAIChatProvider, useXChat } from '@ant-design-x-vue/x-sdk'

const provider = createOpenAIChatProvider({
  baseURL: '/api/proxy/openai/v1/chat/completions',
  model: 'gpt-4o-mini',
})

const { messages, onRequest, isRequesting, abort } = useXChat({
  provider,
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: { role: 'assistant', content: 'Request failed' },
})

const bubbleRoles = {
  user: { placement: 'end' as const },
  assistant: { placement: 'start' as const },
}
</script>

<template>
  <Bubble.List
    :roles="bubbleRoles"
    :items="messages.map(({ id, message, status }) => ({
      key: id,
      role: message.role,
      content: message.content,
      loading: status === 'loading',
    }))"
  />
  <Sender :loading="isRequesting" @cancel="abort" @submit="(v: string) => onRequest({ query: v })" />
</template>
```

Always proxy API keys. `dangerouslyApiKey` / `key` exist for Node or controlled demos only; prefix tokens as `Bearer <token>` unless they already start with `Bearer `, `Basic `, or `Tbox-`.

## Markdown in assistant bubbles

```vue
<script setup lang="ts">
import { h } from 'vue'
import { Bubble } from 'ant-design-x-vue'
import { XMarkdown } from '@ant-design-x-vue/x-markdown'

const bubbleRoles = {
  assistant: {
    placement: 'start' as const,
    contentRender(content: string) {
      return h(XMarkdown, { content })
    },
  },
  user: { placement: 'end' as const },
}
</script>
```

Do not put raw Markdown HTML strings inside `content` and hope they render; use `XMarkdown` via `contentRender` or a dedicated component.

## Mutating history without a request

```ts
setMessages((prev) => prev.filter((m) => m.status !== 'error'))
removeMessage(id)
setMessage(id, (info) => ({ ...info, extraInfo: { ...info.extraInfo, liked: true } }))
```
