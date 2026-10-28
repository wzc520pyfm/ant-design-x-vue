# OpenAIChatProvider

`createOpenAIChatProvider` 是接 OpenAI Chat Completions 的预设。它内部建一个 `manual: true` 的 `XRequest`，再交给 `OpenAIChatProvider`。

```ts
import { createOpenAIChatProvider, useXChat } from 'ant-design-x-vue';

const provider = createOpenAIChatProvider({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  dangerouslyApiKey: 'YOUR_KEY',
});

const { onRequest, messages, abort } = useXChat({ provider });
```

裸 token 会补成 `Bearer <token>`。已经以 `Bearer `、`Basic ` 或 `Tbox-` 开头的值保持原样。`key` 与 `dangerouslyApiKey` 等价。

构造参数、内置 Provider 对照表和本地 mock 示例在 [Chat Provider](/x-sdk/chat-provider)。
