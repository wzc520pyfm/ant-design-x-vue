# OpenAI

这篇指南介绍如何在 Ant Design X Vue 应用中接入 OpenAI（或兼容 Chat Completions 的服务）。更完整的 Provider / `useXChat` 说明见 [X SDK](/x-sdk/introduce)、[Chat Provider](/x-sdk/chat-provider)、[OpenAIChatProvider](/x-sdk/chat-provider-openai)。自定义协议见 [自定义 Chat Provider](/x-sdk/chat-provider-custom)。

Vue 侧用 `createOpenAIChatProvider`（或 `new OpenAIChatProvider({ request })`）接模型，不需要 React 那套 `useXAgent`。

## 使用 X SDK 接入

用 URL + `createOpenAIChatProvider` 接 Chat Completions 是 X SDK 的基础能力。预设会创建 `manual: true` 的 `XRequest`，再交给 `OpenAIChatProvider`，最后用 `useXChat` 驱动气泡与发送。

```ts
import { createOpenAIChatProvider, useXChat } from 'ant-design-x-vue';

const provider = createOpenAIChatProvider({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  // 浏览器直连有泄露风险，生产请走自己的后端代理
  dangerouslyApiKey: 'YOUR_KEY',
});

const { onRequest, messages, isRequesting, abort } = useXChat({
  provider,
  requestPlaceholder: { role: 'assistant', content: '' },
});
```

裸 token 会写成 `Authorization: Bearer <token>`。已经以 `Bearer `、`Basic ` 或 `Tbox-` 开头的值保持原样。`key` 与 `dangerouslyApiKey` 等价。也可用 `new OpenAIChatProvider({ request: XRequest(baseURL, { manual: true, ... }) })` 自己组请求。

文档示例用 mock `fetch`，页面不会带真实密钥，也不会访问外网。

### 示例

:::demo-v2 使用 `createOpenAIChatProvider` + 本地 OpenAI SSE mock：可发送、流式回复、取消。

development/openai-sdk

:::

## 使用 openai-node

通常情况 [openai](https://github.com/openai/openai-node)（openai-node）用于 Node 环境。如果在浏览器里直接用，需要开启 `dangerouslyAllowBrowser`。

> 注意：`dangerouslyAllowBrowser` 存在安全风险，openai-node 官方文档有详细[说明](https://github.com/openai/openai-node?tab=readme-ov-file#requirements)。API Key 不要打进前端包，优先走后端代理。

当 SDK（例如 openai-node、`@openrouter/ai-sdk-provider`）自己发请求时，需要自定义 `AbstractXRequestClass`，再交给 `OpenAIChatProvider` 做消息转换。下面是与 React 指南同结构的 Vue 写法（示意：`run` / `abort` 里需按真实 response 补上流式回调）。

```ts
import {
  AbstractXRequestClass,
  OpenAIChatProvider,
  type SSEFields,
  type XModelMessage,
  type XModelParams,
  type XRequestOptions,
} from 'ant-design-x-vue';
import OpenAI from 'openai';

type OutputType = Partial<Record<SSEFields, any>>;
type InputType = XModelParams;

class OpenAiRequest<
  Input extends InputType = InputType,
  Output extends OutputType = OutputType,
> extends AbstractXRequestClass<Input, Output> {
  client: OpenAI;
  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;

  constructor(baseURL: string, options: XRequestOptions<Input, Output>) {
    super(baseURL, options);
    this.client = new OpenAI({
      apiKey: 'OPENAI_API_KEY',
      dangerouslyAllowBrowser: true,
    });
  }

  get asyncHandler(): Promise<any> {
    return Promise.resolve();
  }

  get isTimeout() {
    return this._isTimeout;
  }

  get isStreamTimeout() {
    return this._isStreamTimeout;
  }

  get isRequesting() {
    return this._isRequesting;
  }

  get manual() {
    return true;
  }

  async run(input?: Input) {
    const { callbacks } = this.options;
    try {
      this._isRequesting = true;
      await this.client.responses.create({
        model: 'gpt-4o',
        input: input?.messages?.[0]?.content || '',
        stream: true,
      });
      // 请基于 response 实现流数据更新：回调 onUpdate / onSuccess
      // Please implement stream updates via onUpdate / onSuccess
    } catch (error: any) {
      callbacks?.onError(error);
    } finally {
      this._isRequesting = false;
    }
  }

  abort() {
    // 请基于 openai 实现 abort
    // Please implement abort based on OpenAI
  }
}

const provider = new OpenAIChatProvider<XModelMessage, InputType, OutputType>({
  request: new OpenAiRequest('OPENAI', {}),
});

// 在组件里：useXChat({ provider }) + Bubble.List / Sender
```

下面的可运行示例不依赖真实 `openai` 包与密钥：用同样的 `AbstractXRequestClass` 壳，在浏览器里 mock 流式 chunk，演示「自定义 Request + `OpenAIChatProvider`」的接法。真实项目把 `run` / `abort` 换成 openai-node（或其它 SDK）即可。

### 示例

:::demo-v2 自定义 `AbstractXRequestClass` 接入（本地 mock，不发外网、不带真实 Key）。生产请换真实 SDK 并走代理。

development/openai-node

:::
