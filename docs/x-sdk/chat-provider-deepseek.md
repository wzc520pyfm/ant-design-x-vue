# DeepSeekChatProvider

`DeepSeekChatProvider` 的请求形状和 OpenAI 相同，并额外读取 `reasoning_content`。构造时同样传入 `manual: true` 的 `XRequest`。

```ts
import { DeepSeekChatProvider, XRequest, useXChat } from 'ant-design-x-vue';

const provider = new DeepSeekChatProvider({
  request: XRequest('https://api.deepseek.com/chat/completions', {
    manual: true,
    headers: { Authorization: 'Bearer YOUR_KEY' },
  }),
});

const chat = useXChat({ provider });
```

和 OpenAI 预设的差别写在 [Chat Provider](/x-sdk/chat-provider) 的对照表里。
