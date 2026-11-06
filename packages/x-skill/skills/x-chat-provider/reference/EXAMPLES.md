# Chat Provider examples (Vue)

## OpenAI class

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design-x-vue/x-sdk'

export const openaiProvider = new OpenAIChatProvider({
  request: XRequest('/api/proxy/openai/v1/chat/completions', {
    manual: true,
    params: { model: 'gpt-4o-mini', stream: true },
  }),
})
```

## DeepSeek (reasoning)

`DeepSeekChatProvider` parses `choices[].delta.content` and `reasoning_content`. Pair the reasoning string with the Vue `Think` component and the visible answer with `XMarkdown`.

## Custom fetch (docs-style mock)

```ts
import { createOpenAIChatProvider } from '@ant-design-x-vue/x-sdk'

const provider = createOpenAIChatProvider({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  fetch: async (_url, init) => {
    // return a Response that looks like OpenAI SSE
    return new Response(/* ... */)
  },
})
```

Never ship `dangerouslyApiKey` in frontend bundles except controlled local demos.
