# OpenAIChatProvider

`createOpenAIChatProvider` is the default interface for OpenAI Chat Completions. It internally builds an `XRequest` with `manual: true` and then hands it to `OpenAIChatProvider`.

```ts
import { createOpenAIChatProvider, useXChat } from 'ant-design-x-vue';

const provider = createOpenAIChatProvider({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  dangerouslyApiKey: 'YOUR_KEY',
});

const { onRequest, messages, abort } = useXChat({ provider });
```

The bare token will be replaced by `Bearer <token>`. Values ​​already starting with `Bearer`, `Basic` or `Tbox-` are left intact. `key` is equivalent to `dangerouslyApiKey`.

The construction parameters, built-in Provider comparison table and local mock examples are in [Chat Provider](/en/x-sdk/chat-provider).
