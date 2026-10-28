# 从 v1 到 v2

`ant-design-x-vue@2.0.0` 对标 React `@ant-design/x@2.0.0` 的数据流。安装主包时会带上同版本的 `@ant-design-x-vue/x-sdk` 和 `@ant-design-x-vue/x-markdown`。

```bash
pnpm add ant-design-x-vue@2.0.0
```

`import { useXChat, XRequest, XStream, useXConversations } from 'ant-design-x-vue'` 拿到的是 SDK。`XMarkdown` 从 `@ant-design-x-vue/x-markdown` 引入。

## 数据流

1. `useXAgent` 不再是 2.0 的模型调度方式。它仍从主包导出，只为旧示例保留。新代码用 `createOpenAIChatProvider({ baseURL, model, dangerouslyApiKey })`，或自己 `new OpenAIChatProvider({ request })`。
2. `useXChat` 改为接收 `provider`。没有 provider 时，`onRequest` / `abort` 会抛出 `provider is required`。返回值包含 `onRequest`、`messages`、`parsedMessages`、`setMessages`、`setMessage`、`abort`、`isRequesting`、`onReload`。`isRequesting` 是 computed。
3. 用 `XRequest(baseURL, options)` 创建请求实例，交给 Provider 时必须 `manual: true`。1.x 的 `XRequest({ baseURL, model, dangerouslyApiKey })` 改名为 `XRequestLegacy`。
4. 1.x 的 `useXChat({ agent })` 改名为 `useLegacyXChat`。旧文档示例已经改用这个名字，避免和 2.0 钩子撞车。
5. `useXConversations` 管理会话列表。它和 `useXChat` 通过会话 key 共享消息。
6. `XStream({ readableStream })` 的调用形式与 1.x 相同，实现改为 SDK。

```vue
<script setup lang="ts">
import {
  OpenAIChatProvider,
  useXChat,
  useXConversations,
  XRequest,
} from 'ant-design-x-vue';

const { activeConversationKey } = useXConversations({
  defaultConversations: [{ key: '1', label: '新对话' }],
  defaultActiveConversationKey: '1',
});

const provider = new OpenAIChatProvider({
  request: XRequest('https://api.example.com/v1/chat/completions', {
    manual: true,
    headers: { Authorization: 'Bearer YOUR_KEY' },
  }),
});

const { messages, onRequest, abort, isRequesting } = useXChat({
  provider,
  conversationKey: activeConversationKey,
});
</script>
```

内置 Provider 还有 `DeepSeekChatProvider` 和 `DefaultChatProvider`。自定义协议时继承 `AbstractChatProvider`，实现 `transformParams`、`transformLocalMessage`、`transformMessage`。

更完整的字段说明见 [SDK 数据流](/x-sdk/data-flow)。

## 发布顺序

三个包的版本都是 `2.0.0`：

1. 先发布 `@ant-design-x-vue/x-sdk`。它没有运行时依赖。
2. 再发布 `ant-design-x-vue` 和 `@ant-design-x-vue/x-markdown`。主包依赖后两者的 `2.0.0`，Markdown 依赖主包的 `2.0.0`。

`npm publish` 本身不检查依赖是否已经在 registry 上。用户执行 `pnpm add ant-design-x-vue@2.0.0` 之前，三个包都要已经发布。发布包里的依赖版本是 `2.0.0`，不能留下 `workspace:*`。

## 和 React 2.0 保持的差异

这些是 Vue 适配，不是漏实现：

- 根节点类名写 Vue 的 `class`。组件如果另外声明了 `className`（例如 XMarkdown、Actions），两个都能用。
- `FileCard.List` 的稳定标识放在列表项的 `key` 上，不放进 `FileCard` 自己的 props。Vue 把 `key` 留给列表渲染。
- `Bubble.List` 同时接受 `roles` 和 `role`。两边都传时用 `roles`。React 2.0 的实现只有 `role`。

## 组件

- Bubble：`messageRender` 改为 `contentRender`。`messageRender` 仍保留为废弃入口。`Bubble.List` 要滚动托管时需要明确高度。
- Sender：操作区使用 `suffix`。不需要默认按钮时设为 `false`。`onPasteFile` 收到的是 `FileList`。
- 文件卡片使用独立的 `FileCard`。文件字节数用 `byte`，卡片尺寸 `size` 为 `'small' | 'default'`。
- ThoughtChain 的 `items` 不再使用 `extra`。

## 旧页面

[useXAgent](https://antd-design-x-vue.netlify.app/component/use-x-agent)、[useXChat](https://antd-design-x-vue.netlify.app/component/use-x-chat)、[XRequest](https://antd-design-x-vue.netlify.app/component/x-request) 这三页在 1.x 文档站。新代码按 [SDK 数据流](/x-sdk/data-flow) 写。
