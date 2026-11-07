# DeepSeekChatProvider

`DeepSeekChatProvider` has the same request format as OpenAI and additionally reads `reasoning_content`. When constructing, also pass in an `XRequest` with `manual: true`.

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

The difference from OpenAI default is written in the comparison table of [Chat Provider](/en/x-sdk/chat-provider).
