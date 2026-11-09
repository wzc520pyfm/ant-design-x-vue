---
name: use-x-chat
version: 2.10.0
description: 讲解 Vue 版 useXChat：自定义 Provider、消息管理、错误处理与多会话。只生成 Vue SFC，不要输出 React JSX。
---

# 技能定位

> **核心**：用 `@ant-design-x-vue/x-sdk` 的 `useXChat` 做 AI 会话。**前提**：已有 Chat Provider（见 [x-chat-provider](../x-chat-provider)）。

本技能面向 **Vue 3**。UI 从 `ant-design-x-vue` 引入，SDK 从 `@ant-design-x-vue/x-sdk` 引入。**禁止**引入 `@ant-design/x` / `@ant-design/x-sdk`，**禁止**输出 React JSX。

# 快速开始

## 依赖

```bash
npm install @ant-design-x-vue/x-sdk ant-design-x-vue ant-design-vue
```

## 三步接入

### 1. 准备 Provider

交给 Provider 的 `XRequest` **必须** `manual: true`，否则抛出 `request must be manual`。

```ts
import { MyChatProvider } from './MyChatProvider'
import { XRequest } from '@ant-design-x-vue/x-sdk'

const provider = new MyChatProvider({
  request: XRequest('https://your-api.com/chat', { manual: true }),
})
```

OpenAI 形态接口可用 Vue 额外提供的 `createOpenAIChatProvider`（对齐 1.x `useXAgent` 的预设 header）：

```ts
import { createOpenAIChatProvider } from '@ant-design-x-vue/x-sdk'

const provider = createOpenAIChatProvider({
  baseURL: '/api/proxy/openai/v1/chat/completions',
  model: 'gpt-4o-mini',
})
```

也可用 `new OpenAIChatProvider`、`DeepSeekChatProvider`、`DefaultChatProvider`。浏览器里不要写真实密钥，走同源代理。

### 2. 基本用法

`messages`、`isRequesting` 是 Vue 的 ref / computed。在 `<script>` 里用 `.value`，模板里会自动解包。

```vue
<script setup lang="ts">
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest, isRequesting } = useXChat({
  provider,
  requestPlaceholder: () => ({ content: '思考中...', role: 'assistant' }),
  requestFallback: (_, { error, messageInfo }) => {
    if (error.name === 'AbortError') {
      return { content: messageInfo?.message?.content || '已取消回复', role: 'assistant' }
    }
    return { content: '网络错误，请稍后重试', role: 'assistant' }
  },
})
</script>
```

### 3. 对接 UI

> **重要**：`messages` 是 `Ref<MessageInfo<ChatMessage>[]>`，**不能**直接传给 `Bubble.List`。必须映射成 `{ key, role, content, loading }`。正文在 `msg.message` 上。

Vue 侧规范字段是 **`roles`**。`role` 仅为对齐 React 2.10；同时传入时 **`roles` 优先**。新代码请写 `roles`。`roles` 对象要保持稳定，不要每次渲染新建。

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue'
import { useXChat } from '@ant-design-x-vue/x-sdk'

const { messages, onRequest, isRequesting, abort } = useXChat({ provider })

const bubbleRoles = {
  user: { placement: 'end' as const },
  assistant: { placement: 'start' as const },
}
</script>

<template>
  <div style="height: 600px">
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
      @submit="(content: string) => onRequest({ query: content })"
      @cancel="abort"
    />
  </div>
</template>
```

当 `ChatMessage` 是对象时，把整个 `message` 当作 `content`，用 `contentRender` + `h()` 渲染（不要写 JSX）：

```ts
import { h } from 'vue'
import { FileCard } from 'ant-design-x-vue'

const bubbleRoles = {
  assistant: {
    placement: 'start' as const,
    contentRender(content: MyMessage) {
      return h('div', [
        h('div', content.content),
        ...(content.attachments ?? []).map((a) => h(FileCard, { key: a.url, name: a.name })),
      ])
    },
  },
}
```

# 核心概念

```ts
interface MessageInfo<ChatMessage> {
  id: number | string
  message: ChatMessage
  status: 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort'
  extraInfo?: AnyObject
}
```

### 配置

| 选项 | 说明 |
| --- | --- |
| `provider` | **必填** |
| `conversationKey` | 多会话时必填，可与 `useXConversations().activeConversationKey` 对齐 |
| `defaultMessages` | 支持数组、同步函数、异步函数 |
| `requestPlaceholder` / `requestFallback` | 请求中占位 / 失败兜底（`AbortError` 当取消） |
| `parser` | 一对多转换，结果走 `parsedMessages` |

### 返回值

`messages`（Ref）、`parsedMessages`（ComputedRef）、`onRequest`、`onReload`、`isRequesting`（ComputedRef）、`isDefaultMessagesRequesting`、`abort`、`setMessages` / `setMessage` / `removeMessage`、`queueRequest`。

# 多会话

`useXConversations` 的 `conversations` 和 `activeConversationKey` 是 `ShallowRef`。

**每个会话必须有独立的 Provider 实例**，否则请求状态会串。

```ts
const providerCache = new Map<string, OpenAIChatProvider<any, any, any>>()

function getProvider(key: string) {
  let p = providerCache.get(key)
  if (!p) {
    p = new OpenAIChatProvider({
      request: XRequest('/api/proxy/chat', { manual: true, params: { model: 'gpt-4o', stream: true } }),
    })
    providerCache.set(key, p)
  }
  return p
}

const { conversations, activeConversationKey, setActiveConversationKey, addConversation } =
  useXConversations({
    defaultConversations: [{ key: 'conv-1', label: '新会话' }],
    defaultActiveConversationKey: 'conv-1',
  })

const { messages, onRequest, queueRequest } = useXChat({
  provider: getProvider(activeConversationKey.value),
  conversationKey: activeConversationKey,
})
```

用户切换会话同时要发第一条消息时，用 `queueRequest(newKey, params)`，等该会话 `defaultMessages` 加载完再发出。

# 开发规则

- [ ] 必须有 Provider
- [ ] Provider 的 XRequest 配置 `manual: true`
- [ ] 消息正文在 `msg.message`
- [ ] `Bubble.List` 使用 **`roles`**（`role` 是别名，同时传时 `roles` 优先）
- [ ] 每个会话独立 Provider
- [ ] `<script setup lang="ts">` + 模板：`class` / `:style` / `@submit`，不要 `className` / JSX
- [ ] 不要在 Vue `XProvider` 上写 `theme.zeroRuntime`
- [ ] 用户没要求就不要加测试文件

# 参考

- [API.md](reference/API.md)
- [CORE.md](reference/CORE.md)
- [EXAMPLES.md](reference/EXAMPLES.md)
- 站点文档：https://x-vue.ant.design/x-sdk/use-x-chat
