# 通义千问

这篇指南介绍如何在 Ant Design X Vue 应用中接入通义千问（Qwen）模型服务。

Qwen 的模型推理服务支持「兼容 OpenAI 模式」。详见官方文档：[阿里云 - 通义千问](https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope)。

Vue 没有单独的 QwenChatProvider。兼容模式下，把 DashScope 的 Chat Completions 地址和模型名交给 `createOpenAIChatProvider`（或 `OpenAIChatProvider`）即可。Provider / `useXChat` 细节见 [X SDK](/x-sdk/introduce)、[Chat Provider](/x-sdk/chat-provider)、[OpenAIChatProvider](/x-sdk/chat-provider-openai)。

React 侧同主题文档可作对照：https://x.ant.design/docs/react/model-use-qwen-cn/ 。

### 相关参数获取

- [如何获取 baseURL](https://help.aliyun.com/zh/model-studio/getting-started/what-is-model-studio)
- [如何获取 API Key](https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key)
- [模型列表](https://help.aliyun.com/zh/model-studio/getting-started/models)

### 什么是「兼容 OpenAI 模式」？

是指在接口设计和使用方式上与 OpenAI 的 API 保持一致的模型推理服务。

这意味着开发者可以使用与调用 OpenAI 模型相同的代码和方法，来调用这些兼容服务，从而减少开发接入成本。

## 使用 X SDK 接入

使用 URL 接入模型是 X SDK 提供的基础能力。通义千问兼容模式的 `baseURL` 指向 DashScope 的 compatible-mode Chat Completions 端点，`model` 写成千问模型名（如 `qwen-plus`）。

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

文档示例把 `fetch` 换成本地 mock，页面不会带真实密钥，也不会访问 DashScope。

### 示例

:::demo-v2 `createOpenAIChatProvider` + DashScope 兼容模式地址（本地 mock SSE）。

development/qwen-sdk

:::

## 使用 openai-node 兼容调用

> 注意：🔥 `dangerouslyAllowBrowser` 存在安全风险，openai-node 官方文档有详细[说明](https://github.com/openai/openai-node?tab=readme-ov-file#requirements)。API Key 不要打进前端包。

与 OpenAI 类似，可用 openai-node 指向 DashScope 兼容模式的 `baseURL`，再通过自定义 `AbstractXRequestClass` 交给 `OpenAIChatProvider`。下面是 Vue 示意代码（需自行补全流式回调与 abort）。

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

下面的可运行示例同样不依赖真实密钥：用 `AbstractXRequestClass` + 本地 mock 流，演示兼容模式下的自定义 Request 接法。

### 示例

:::demo-v2 自定义 Request 兼容调用通义千问（本地 mock，逻辑参考；调试真实服务请填写正确 API Key 并走代理）。

development/qwen-openai-node

:::
