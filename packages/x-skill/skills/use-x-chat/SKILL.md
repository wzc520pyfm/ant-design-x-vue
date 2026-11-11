---
name: use-x-chat
version: 2.10.0
description: Use the Vue useXChat composable — custom Provider integration, message management, error handling, and multi-conversation. Always generate Vue SFCs, never React JSX.
---

# Skill Positioning

> **Core**: Build AI conversations with `useXChat` from `@ant-design-x-vue/x-sdk`. **Prerequisite**: a Chat Provider (see [x-chat-provider](../x-chat-provider)).

This skill is for **Vue 3**. Import UI from `ant-design-x-vue` and the SDK from `@ant-design-x-vue/x-sdk`. Do **not** import `@ant-design/x` or `@ant-design/x-sdk`. Do **not** emit React JSX.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Multi-conversation](#multi-conversation)
- [Development Rules](#development-rules)
- [Reference](#reference)

# Quick Start

## Dependencies

- `@ant-design-x-vue/x-sdk`: current 2.x
- `ant-design-x-vue`: UI (`Bubble`, `Sender`, `Conversations`, …)
- `ant-design-vue`: base components if needed

```bash
npm install @ant-design-x-vue/x-sdk ant-design-x-vue ant-design-vue
```

## Three-step integration

### 1. Prepare a Provider

`XRequest` passed into a Provider **must** use `manual: true` (otherwise the SDK throws `request must be manual`).

```ts
import { MyChatProvider } from './MyChatProvider'
import { XRequest } from '@ant-design-x-vue/x-sdk'

const provider = new MyChatProvider({
  request: XRequest('https://your-api.com/chat', { manual: true }),
})
```

For OpenAI-shaped APIs, Vue also ships `createOpenAIChatProvider` (preset headers, same idea as 1.x `useXAgent`):

```ts
import { createOpenAIChatProvider } from '@ant-design-x-vue/x-sdk'

const provider = createOpenAIChatProvider({
  baseURL: '/api/proxy/openai/v1/chat/completions',
  model: 'gpt-4o-mini',
  // Prefer a same-origin proxy. Do not put real keys in browser code.
})
```

You can also `new OpenAIChatProvider({ request: XRequest(url, { manual: true }) })` or use `DeepSeekChatProvider` / `DefaultChatProvider`.

### 2. Basic usage

`messages` and `isRequesting` are Vue refs / computed refs. In `<script>` use `.value`; in `<template>` they unwrap.

```vue
<script setup lang="ts">
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest, isRequesting } = useXChat({
  provider,
  requestPlaceholder: () => ({
    content: 'Thinking...',
    role: 'assistant',
  }),
  requestFallback: (_, { error, messageInfo }) => {
    if (error.name === 'AbortError') {
      return { content: messageInfo?.message?.content || 'Reply cancelled', role: 'assistant' }
    }
    return { content: 'Network error, please try again later', role: 'assistant' }
  },
})
</script>

<template>
  <div>
    <div v-for="msg in messages" :key="msg.id">
      {{ msg.message.role }}: {{ msg.message.content }}
    </div>
    <button :disabled="isRequesting" @click="onRequest({ query: 'Hello' })">Send</button>
  </div>
</template>
```

### 3. UI integration

> **Important**: `messages` is `Ref<MessageInfo<ChatMessage>[]>`. You **cannot** pass it straight to `Bubble.List`. Map each item to `{ key, role, content, loading }`. Content lives on `msg.message`.

Vue’s canonical list prop is **`roles`**. `role` is accepted for React 2.10 parity; if both are set, **`roles` wins**. Prefer `roles` in new Vue code.

Keep the `roles` object stable (module-level or a `const` in `setup`, not recreated inside a render function).

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest, isRequesting, abort } = useXChat({ provider })

const bubbleRoles = {
  user: { placement: 'end' as const },
  assistant: { placement: 'start' as const },
}

function bubbleItems() {
  return messages.value.map(({ id, message, status }) => ({
    key: id,
    role: message.role,
    content: message.content,
    loading: status === 'loading',
  }))
}
</script>

<template>
  <div style="height: 600px">
    <Bubble.List :roles="bubbleRoles" :items="bubbleItems()" />
    <Sender
      :loading="isRequesting"
      @submit="(content: string) => onRequest({ query: content })"
      @cancel="abort"
    />
  </div>
</template>
```

In templates you may also write `:items="messages.map(...)"` — Vue unwraps the ref automatically.

#### When `ChatMessage` is an object

Pass the whole `message` as `content` and render with `contentRender` (returns a VNode via `h()`, not JSX):

```vue
<script setup lang="ts">
import { h } from 'vue'
import { Bubble, FileCard } from 'ant-design-x-vue'
import type { MyMessage } from './types'

const bubbleRoles = {
  assistant: {
    placement: 'start' as const,
    contentRender(content: MyMessage) {
      return h('div', [
        h('div', content.content),
        ...(content.attachments ?? []).map((a) =>
          h(FileCard, { key: a.url, name: a.name }),
        ),
      ])
    },
  },
  user: {
    placement: 'end' as const,
    contentRender(content: MyMessage) {
      return content.content
    },
  },
}
</script>

<template>
  <Bubble.List
    :roles="bubbleRoles"
    :items="messages.map(({ id, message, status }) => ({
      key: id,
      role: message.role,
      content: message,
      loading: status === 'loading',
    }))"
  />
</template>
```

# Core Concepts

## Data model

```ts
interface MessageInfo<ChatMessage> {
  id: number | string
  message: ChatMessage // actual payload — not the top-level object
  status: MessageStatus
  extraInfo?: AnyObject // extraInfo, not extra
}

type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort'
```

- `local`: locally sent user message
- `loading`: placeholder (`requestPlaceholder`)
- `updating`: streaming
- `success` / `error` / `abort`

## `useXChat` options

| Option | Type | Description |
| --- | --- | --- |
| `provider` | `AbstractChatProvider<ChatMessage, Input, Output>` | **Required**. Without it, `onRequest` / `abort` throw `provider is required`. |
| `conversationKey` | `string` or `ShallowRef<string \| undefined>` | Required for multi-conversation. Align with `useXConversations().activeConversationKey`. |
| `defaultMessages` | array, sync fn, or async fn | History; async fn can load remote history. |
| `requestPlaceholder` | message or `(params, { messages }) => message` | Shown while requesting |
| `requestFallback` | message or `(params, { error, messages, messageInfo }) => message` | Failure / abort. Treat `error.name === 'AbortError'` as cancel. |
| `parser` | `(message) => Parsed \| Parsed[]` | Optional one-to-many transform; then read `parsedMessages` |

## Return values (Vue refs)

| Name | Type | Description |
| --- | --- | --- |
| `messages` | `Ref<MessageInfo<ChatMessage>[]>` | Map before `Bubble.List` |
| `parsedMessages` | `ComputedRef<MessageInfo<ParsedMessage>[]>` | After `parser` |
| `onRequest` | `(params, opts?) => void` | Append + request |
| `onReload` | `(id, params, opts?) => void` | Replay one assistant message |
| `isRequesting` | `ComputedRef<boolean>` | In-flight request |
| `isDefaultMessagesRequesting` | `Ref<boolean>` | Async `defaultMessages` loading |
| `abort` | `() => void` | Cancel current request |
| `setMessages` / `setMessage` / `removeMessage` | store helpers | Mutate without requesting |
| `queueRequest` | `(conversationKey, params, opts?) => void` | Send after that conversation’s `defaultMessages` finish |

# Multi-conversation

`conversations` and `activeConversationKey` from `useXConversations` are `ShallowRef`s.

**Each conversation needs its own Provider instance** or request state will mix.

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { Bubble, Conversations, Sender } from 'ant-design-x-vue'
import {
  OpenAIChatProvider,
  XRequest,
  useXChat,
  useXConversations,
} from '@ant-design-x-vue/x-sdk'

const BASE_URL = '/api/proxy/chat'
const providerCache = new Map<string, OpenAIChatProvider<any, any, any>>()

function getProvider(key: string) {
  let p = providerCache.get(key)
  if (!p) {
    p = new OpenAIChatProvider({
      request: XRequest(BASE_URL, { manual: true, params: { model: 'gpt-4o', stream: true } }),
    })
    providerCache.set(key, p)
  }
  return p
}

const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
} = useXConversations({
  defaultConversations: [{ key: 'conv-1', label: 'New Conversation' }],
  defaultActiveConversationKey: 'conv-1',
})

const { messages, onRequest, isRequesting, abort, queueRequest } = useXChat({
  provider: getProvider(activeConversationKey.value),
  conversationKey: activeConversationKey,
  defaultMessages: async ({ conversationKey }) => {
    return []
  },
  requestFallback: (_, { error, messageInfo }) => {
    if (error.name === 'AbortError') {
      return { content: messageInfo?.message?.content || 'Cancelled', role: 'assistant' }
    }
    return { content: 'Request failed', role: 'assistant' }
  },
})

const bubbleRoles = {
  assistant: { placement: 'start' as const },
  user: { placement: 'end' as const },
}

function handleNewConversation() {
  const newKey = `conv-${Date.now()}`
  addConversation({ key: newKey, label: `New Conversation ${conversations.value.length + 1}` })
  setActiveConversationKey(newKey)
}

// After switching, you can queue the first message until history is loaded:
function handleNewWithHello() {
  const newKey = `conv-${Date.now()}`
  addConversation({ key: newKey, label: 'New Conversation' })
  setActiveConversationKey(newKey)
  queueRequest(newKey, {
    messages: [{ role: 'user', content: 'Hello! Please introduce yourself.' }],
  })
}
</script>

<template>
  <div style="display: flex; height: 100vh">
    <Conversations
      :items="conversations"
      :active-key="activeConversationKey"
      @active-change="setActiveConversationKey"
      :creation="{ onClick: handleNewConversation }"
    />
    <div style="flex: 1; display: flex; flex-direction: column">
      <Bubble.List
        :roles="bubbleRoles"
        :items="messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role,
          content: message.content,
          loading: status === 'loading',
        }))"
      />
      <Sender
        :loading="isRequesting"
        @cancel="abort"
        @submit="(val: string) => onRequest({ messages: [{ role: 'user', content: val }] })"
      />
    </div>
  </div>
</template>
```

# Development Rules

- [ ] Always pass a Provider (built-in or custom).
- [ ] Provider `XRequest` uses `manual: true`.
- [ ] Message text is `msg.message`, not `msg.content`.
- [ ] Map `messages` before `Bubble.List`. Prefer Vue prop **`roles`** (`role` is alias; `roles` wins).
- [ ] One Provider instance per conversation.
- [ ] Use `<script setup lang="ts">` + template. `class` / `:style` / `@submit`, not `className` / JSX.
- [ ] Do not invent `theme.zeroRuntime` on Vue `XProvider`.
- [ ] Do not add test files unless the user asked.

# Reference

- [API.md](reference/API.md)
- [CORE.md](reference/CORE.md)
- [EXAMPLES.md](reference/EXAMPLES.md)
- Site: https://x-vue.ant.design/x-sdk/use-x-chat
- Conversations: https://x-vue.ant.design/x-sdk/use-x-conversations
