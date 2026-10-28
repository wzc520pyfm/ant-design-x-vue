# Chat Provider

Provider 交给 `useXChat`，负责组请求参数和把 chunk 收成消息。构造时的 `request` 必须 `manual: true`，否则抛出 `request must be manual`。

## createOpenAIChatProvider

这是 1.x `useXAgent({ baseURL, model, dangerouslyApiKey | key })` 在 2.0 里的入口。React 2.0 删掉了 `useXAgent`，直接 `new OpenAIChatProvider`。Vue 保留那个预设形状，避免调用方再手写 header。

```ts
import { createOpenAIChatProvider, useXChat } from 'ant-design-x-vue';

const provider = createOpenAIChatProvider({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  dangerouslyApiKey: 'YOUR_KEY',
});

const { onRequest, messages, isRequesting, abort } = useXChat({
  provider,
  requestPlaceholder: { role: 'assistant', content: '' },
});
```

裸 token 写成 `Bearer <token>`。已经以 `Bearer `、`Basic ` 或 `Tbox-` 开头的值不变。`key` 与 `dangerouslyApiKey` 等价。可选 `fetch` 用来换成 mock 或代理，文档示例用它，避免在页面里放真实密钥。

## 内置 Provider

| 类 | 行为 |
| --- | --- |
| DefaultChatProvider | 几乎不改请求和响应。`transformMessage` 直接把 chunk 当消息 |
| OpenAIChatProvider | 解析 Chat Completions 的 `choices[].delta.content` / `message.content`，遇到 `[DONE]` 结束 |
| DeepSeekChatProvider | 与 OpenAI 相同，并额外读取 `reasoning_content` |

自定义协议时继承 `AbstractChatProvider`，实现：

- `transformParams(requestParams, options)`
- `transformLocalMessage(requestParams)`
- `transformMessage({ originMessage, chunk, chunks, status, responseHeaders })`

React 的百宝箱示例就是这样接的。浏览器文档里没有 Node 版 Tbox SDK，见 [百宝箱样板间](/playground/agent-tbox)。

## 本地预设

:::demo-v2 `createOpenAIChatProvider` 加一个 mock fetch。输入一句话就会按 OpenAI SSE 把回复流回来。

x-sdk/preset

:::
