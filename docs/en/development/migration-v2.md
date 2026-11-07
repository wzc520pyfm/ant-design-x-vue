# From v1 to v2

`ant-design-x-vue@2.0.0` benchmarks the data flow of React `@ant-design/x@2.0.0`. When installing the main package, the same version of `@ant-design-x-vue/x-sdk` and `@ant-design-x-vue/x-markdown` will be brought.

```bash
pnpm add ant-design-x-vue@2.0.0
```

`import { useXChat, XRequest, XStream, useXConversations } from 'ant-design-x-vue'` gets the SDK. `XMarkdown` is imported from `@ant-design-x-vue/x-markdown`.

## Data flow

1. `useXAgent` is no longer the model scheduling method in 2.0. It is still exported from the main package and is only reserved for old examples. Use `createOpenAIChatProvider({ baseURL, model, dangerouslyApiKey })` for new code, or use `new OpenAIChatProvider({ request })` yourself.
2. `useXChat` accepts `provider` instead. When there is no provider, `onRequest` / `abort` will throw `provider is required`. Return values ​​include `onRequest`, `messages`, `parsedMessages`, `setMessages`, `setMessage`, `removeMessage`, `abort`, `isRequesting`, `isDefaultMessagesRequesting`, `onReload`, `queueRequest`. `isRequesting` / `isDefaultMessagesRequesting` are reactive (computed / ref).
3. Use `XRequest(baseURL, options)` to create a request instance, which must be `manual: true` when passing it to Provider. 1.x's `XRequest({ baseURL, model, dangerouslyApiKey })` was renamed to `XRequestLegacy`.
4. `useXChat({ agent })` in 1.x is renamed to `useLegacyXChat`. Old documentation examples have been renamed to avoid collision with 2.0 hooks.
5. `useXConversations` manages the conversation list. It and `useXChat` share messages via session key.
6. The calling form of `XStream({ readableStream })` is the same as 1.x, and the implementation is changed to SDK.

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

The built-in Provider also includes `DeepSeekChatProvider` and `DefaultChatProvider`. When customizing the protocol, inherit `AbstractChatProvider` and implement `transformParams`, `transformLocalMessage`, and `transformMessage`.

For a more complete field description, see [SDK Data Flow](/en/x-sdk/data-flow).

## Publish order

The versions of the three packages are all `2.0.0`:

1. Publish `@ant-design-x-vue/x-sdk` first. It has no runtime dependencies.
2. Re-release `ant-design-x-vue` and `@ant-design-x-vue/x-markdown`. The main package depends on `2.0.0` of the latter two, and Markdown depends on `2.0.0` of the main package.

`npm publish` itself does not check whether the dependency is already on the registry. Before the user executes `pnpm add ant-design-x-vue@2.0.0`, all three packages must have been published. The dependency version in the release package is `2.0.0`, and `workspace:*` cannot be left.

## Intentional differences from React 2.0

These are Vue adaptations, not leaky implementations:

- Root class name is Vue’s `class`. If the component declares `className` in addition (such as XMarkdown, Actions), both can be used.
- The stable identifier of `FileCard.List` is placed on the `key` of the list item, not `FileCard`’s own props. Vue leaves `key` to list rendering.
- `Bubble.List` accepts both `roles` and `role`. Use `roles` when passing from both sides. The implementation of React 2.0 only has `role`.

## Components

- Bubble: `messageRender` changed to `contentRender`. `messageRender` remains a deprecated entry. `Bubble.List` requires an explicit height when scrolling the hosted list.
- Sender: Use `suffix` in the operation area. Set to `false` when the default button is not required. What `onPasteFile` receives is `FileList`.
- Use separate `FileCard` for file cards. The number of bytes in the file is `byte`, and the card size `size` is `'small' | 'default'`.
- ThoughtChain’s `items` no longer uses `extra`.

## Legacy pages

[useXAgent](https://antd-design-x-vue.netlify.app/component/use-x-agent), [useXChat](https://antd-design-x-vue.netlify.app/component/use-x-chat), [XRequest](https://antd-design-x-vue.netlify.app/component/x-request) These three pages are in 1.x documentation site. New code is written according to [SDK data flow](/en/x-sdk/data-flow).
