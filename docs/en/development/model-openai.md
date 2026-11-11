# OpenAI

This guide describes how to connect OpenAI (or a service compatible with Chat Completions) in an Ant Design X Vue application. For a more complete description of Provider / `useXChat`, see [X SDK](/en/x-sdk/introduce), [Chat Provider](/en/x-sdk/chat-provider), [OpenAIChatProvider](/en/x-sdk/chat-provider-openai). For custom protocols, see [Custom Chat Provider](/en/x-sdk/chat-provider-custom).

Vue uses `createOpenAIChatProvider` (or `new OpenAIChatProvider({ request })`) to connect the model, and does not need the `useXAgent` of React.

## Integrate with X SDK

Using URL + `createOpenAIChatProvider` to connect Chat Completions is the basic capability of X SDK. By default, an `XRequest` with `manual: true` will be created, then handed over to `OpenAIChatProvider`, and finally `useXChat` will be used to drive bubbles and sending.

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

The bare token will be written as `Authorization: Bearer <token>`. Values ​​already starting with `Bearer`, `Basic` or `Tbox-` are left intact. `key` is equivalent to `dangerouslyApiKey`. You can also use `new OpenAIChatProvider({ request: XRequest(baseURL, { manual: true, ... }) })` to set your own request.

The document example uses mock `fetch`. The page will not carry the real key and will not access the external network.

### Example

:::demo-v2 `createOpenAIChatProvider` plus a local OpenAI SSE mock: send, stream, and cancel.

development/openai-sdk

:::

## Use openai-node

Usually [openai](https://github.com/openai/openai-node) (openai-node) is used for Node environment. If you use it directly in the browser, you need to enable `dangerouslyAllowBrowser`.

> Note: `dangerouslyAllowBrowser` has security risks. The official documentation of openai-node has detailed [description](https://github.com/openai/openai-node?tab=readme-ov-file#requirements). Do not enter the API Key into the front-end package, give priority to the back-end proxy.

When the SDK (such as openai-node, `@openrouter/ai-sdk-provider`) sends a request by itself, it needs to customize `AbstractXRequestClass` and then hand it over to `OpenAIChatProvider` for message conversion. The following is the Vue writing method with the same structure as the React guide (instructions: `run` / `abort` needs to be filled with streaming callbacks according to the real response).

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

The following runnable example does not rely on the real `openai` package and key: use the same `AbstractXRequestClass` shell to mock the streaming chunk in the browser to demonstrate the connection method of "custom Request + `OpenAIChatProvider`". For real projects, just replace `run` / `abort` with openai-node (or other SDK).

### Example

:::demo-v2 Custom `AbstractXRequestClass` (local mock, no public network or real key). Use a real SDK behind a proxy in production.

development/openai-node

:::
