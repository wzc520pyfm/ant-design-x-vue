# Patterns

## Chat column

`XProvider` → optional `Conversations` sidebar → `Bubble.List` (mapped `useXChat` messages, stable `roles`) → `Sender` bound to `onRequest` / `abort` / `isRequesting`.

Assistant `contentRender` often returns `h(XMarkdown, { content, streaming: status === 'updating' })`.

## DeepSeek reasoning

`DeepSeekChatProvider` fills `reasoning_content`. Show it with `Think` above `XMarkdown` inside assistant `contentRender`.

## Do not

- Import `@ant-design/x` or write JSX
- Pass `messages` from `useXChat` straight into `Bubble.List`
- Recreate `roles` / `components` inside a computed that returns a new object every time unless necessary
- Put API keys in frontend `XRequest` headers
