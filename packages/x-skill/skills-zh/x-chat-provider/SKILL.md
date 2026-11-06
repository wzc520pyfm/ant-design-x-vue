---
name: x-chat-provider
version: 2.0.0
description: 实现面向 Vue 的 Chat Provider，把任意流式接口适配成 @ant-design-x-vue/x-sdk 标准格式。不要输出 React 包名或 JSX。
---

# 技能定位

**只解决一件事**：如何把你的流式接口适配成 Ant Design X Vue 的 Chat Provider。

**不包含**：`useXChat` 用法（见 `use-x-chat`）。

# 技术栈

| 层 | 包名 |
| --- | --- |
| UI | `ant-design-x-vue` |
| 逻辑 | `@ant-design-x-vue/x-sdk` |
| 渲染 | `@ant-design-x-vue/x-markdown` |

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
```

# 怎么选 Provider

1. 标准 OpenAI Chat Completions → `createOpenAIChatProvider` 或 `new OpenAIChatProvider`
2. DeepSeek（含 `reasoning_content`）→ `DeepSeekChatProvider`
3. 响应已经是你想展示的形状 → `DefaultChatProvider`（透传，用 `contentRender` 渲染）
4. 其它协议 → 继承 `AbstractChatProvider`，实现三个方法

Vue 额外提供 `createOpenAIChatProvider({ baseURL, model, dangerouslyApiKey | key, fetch })`，保留 1.x `useXAgent` 的预设 header。浏览器请走代理，不要写死密钥。token 会补成 `Bearer <token>`（已是 `Bearer ` / `Basic ` / `Tbox-` 前缀的保持不变）。

# 自定义 Provider 四步

只实现：

- `transformParams(requestParams, options)` — 必须带第二个 `options`
- `transformLocalMessage(requestParams)` — 用户侧本地消息，可返回数组
- `transformMessage({ originMessage, chunk, chunks, status, responseHeaders })` — **只返回消息对象，不要带 `status` 字段**

不要自己实现 `request` 方法。

实例化时：

```ts
const provider = new MyChatProvider({
  request: XRequest('https://your-api.com/chat', { manual: true }),
})
```

`XRequest(...)` 返回带 `run` / `abort` 的**实例**，不是一个可以直接 `await request()` 的函数。

# 开发规则

- Provider 的请求必须 `manual: true`
- 从 `@ant-design-x-vue/x-sdk` 引入，不要用 `@ant-design/x-sdk`
- 不要在 `transformMessage` 里发 HTTP

# 参考

- [EXAMPLES.md](reference/EXAMPLES.md)
- https://x-vue.ant.design/x-sdk/chat-provider
