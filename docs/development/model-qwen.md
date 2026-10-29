# 通义千问

Vue 没有单独的 QwenChatProvider。通义千问的 OpenAI 兼容接口可以直接交给 `createOpenAIChatProvider`，把 `baseURL` 换成兼容模式的 chat completions 地址，`model` 写成千问的模型名。

```ts
import { createOpenAIChatProvider } from 'ant-design-x-vue';

const provider = createOpenAIChatProvider({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  dangerouslyApiKey: 'YOUR_KEY',
});
```

密钥仍建议放在自己的代理后面，不要打进前端包。React 的千问专页：https://x.ant.design/docs/react/model-use-qwen-cn 。
