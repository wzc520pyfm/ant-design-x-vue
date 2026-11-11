# Qwen

This guide introduces how to access the Qwen model service in the Ant Design X Vue application.

Qwen’s model inference service supports “OpenAI mode compatibility”. For details, please see the official document: [Alibaba Cloud - Tongyi Qianwen](https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope).

Vue does not have a separate QwenChatProvider. In compatibility mode, just give DashScope's Chat Completions address and model name to `createOpenAIChatProvider` (or `OpenAIChatProvider`). Provider / `useXChat` For details, see [X SDK](/en/x-sdk/introduce), [Chat Provider](/en/x-sdk/chat-provider), [OpenAIChatProvider](/en/x-sdk/chat-provider-openai).

The React side and theme documents can be compared: https://x.ant.design/docs/react/model-use-qwen-cn/.

### Related parameters

- [How to get baseURL](https://help.aliyun.com/zh/model-studio/getting-started/what-is-model-studio)
- [How to get API Key](https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key)
- [Model List](https://help.aliyun.com/zh/model-studio/getting-started/models)

### What is OpenAI-compatible mode?

It refers to a model inference service that is consistent with OpenAI’s API in terms of interface design and usage.

This means that developers can use the same code and methods to call OpenAI models to call these compatible services, thereby reducing development access costs.

## Integrate with X SDK

Using the URL access model is a basic capability provided by X SDK. The `baseURL` of Tongyi Qianwen compatible mode points to the compatible-mode Chat Completions endpoint of DashScope, and `model` is written as the Qwen model name (such as `qwen-plus`).

```ts
import { createOpenAIChatProvider, useXChat } from 'ant-design-x-vue';

const provider = createOpenAIChatProvider({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  // 浏览器直连有泄露风险，生产请走自己的后端代理
  dangerouslyApiKey: 'YOUR_KEY',
});

const { onRequest, messages, isRequesting, abort } = useXChat({
  provider,
  requestPlaceholder: { role: 'assistant', content: '' },
});
```

The document example replaces `fetch` with a local mock. The page will not carry real keys and will not access DashScope.

### Example

:::demo-v2 `createOpenAIChatProvider` with a DashScope-compatible endpoint (local SSE mock).

development/qwen-sdk

:::

## Compatible calls with openai-node

> Note: 🔥 `dangerouslyAllowBrowser` has security risks. The official documentation of openai-node has detailed [description](https://github.com/openai/openai-node?tab=readme-ov-file#requirements). Do not enter the API Key into the front-end package.

Similar to OpenAI, you can use openai-node to point to the `baseURL` of DashScope compatibility mode, and then pass it to `OpenAIChatProvider` by customizing `AbstractXRequestClass`. The following is the Vue schematic code (you need to complete the streaming callback and abort yourself).

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
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
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
      await this.client.chat.completions.create({
        model: 'qwen-plus',
        messages: (input?.messages || []) as any,
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
  request: new OpenAiRequest('QWEN', {}),
});
```

The following runnable example also does not rely on real keys: using `AbstractXRequestClass` + local mock stream to demonstrate the custom Request connection method in compatibility mode.

### Example

:::demo-v2 A custom Request compatible with Qwen (local mock for reference; use a real API key and proxy against a live service).

development/qwen-openai-node

:::
