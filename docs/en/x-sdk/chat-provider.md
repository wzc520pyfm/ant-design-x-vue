# Chat Provider

The Provider is handed over to `useXChat`, which is responsible for grouping request parameters and collecting chunk messages. `request` during construction must be `manual: true`, otherwise `request must be manual` is thrown.

## createOpenAIChatProvider

This is the entry point of 1.x `useXAgent({ baseURL, model, dangerouslyApiKey | key })` in 2.10. React 2.10 deleted `useXAgent` and directly used `new OpenAIChatProvider`. Vue retains the default shape to prevent the caller from handwriting the header.

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

The naked token is written as `Bearer <token>`. Values ​​already starting with `Bearer`, `Basic` or `Tbox-` are unchanged. `key` is equivalent to `dangerouslyApiKey`. The optional `fetch` can be used to replace it with a mock or proxy, the documentation examples use it to avoid putting real keys in the page.

## Built-in providers

| Class | Behavior |
| --- | --- |
| DefaultChatProvider | Almost unchanged requests and responses. `transformMessage` directly treats chunk as message |
| OpenAIChatProvider | Parse the `choices[].delta.content` / `message.content` of Chat Completions, and end when encountering `[DONE]` |
| DeepSeekChatProvider | Same as OpenAI, and additionally reads `reasoning_content` |

Inherit `AbstractChatProvider` when customizing the protocol and implement:

- `transformParams(requestParams, options)`
- `transformLocalMessage(requestParams)`
- `transformMessage({ originMessage, chunk, chunks, status, responseHeaders })`

The React Toolbox example is connected in this way. There is no Node version of the Tbox SDK in the browser documentation, see [Toolbox Playground](/en/playground/agent-tbox).

## Local presets and examples

All documentation examples use a mock `fetch` and do not include real keys.

### OpenAI preset

:::demo-v2 Add a mock fetch to `createOpenAIChatProvider`. Typing a sentence will stream the response back via OpenAI SSE.

x-sdk/preset

:::

### DefaultChatProvider

:::demo-v2 Customize JSON `fetch` with almost no change to the request and response format.

x-sdk/x-chat/custom-request

:::

### OpenAIChatProvider

:::demo-v2 The same local pipeline as above, shown with bubbles and Sender.

x-sdk/x-chat/model

:::

### DeepSeekChatProvider

:::demo-v2 Additionally read `reasoning_content`, the Think component displays the reasoning process (locally mocked).

x-sdk/x-chat/deepSeek

:::
