# useXChat core notes (Vue)

## Provider first

`useXChat` does not talk HTTP by itself. A Provider (`OpenAIChatProvider`, `DeepSeekChatProvider`, `DefaultChatProvider`, or a class extending `AbstractChatProvider`) adapts params and stream chunks.

The Provider’s `request` must be `XRequest(url, { manual: true, ... })`.

## Mapping to Bubble.List

```ts
messages.value.map(({ id, message, status }) => ({
  key: id,
  role: message.role,
  content: message.content,
  loading: status === 'loading',
}))
```

- Prefer `:roles` on `Bubble.List`. `role` is an alias; `roles` wins when both are passed.
- Keep the roles object stable to avoid resetting typing animations.
- For object-shaped messages, set `content: message` and implement `contentRender` with `h()`.

## Placeholders and fallbacks

- `requestPlaceholder` → status `loading`
- Streaming chunks → status `updating`
- Success → `success`
- Network error → `requestFallback` with `error`
- User cancel → `requestFallback` with `error.name === 'AbortError'` (often keep partial `messageInfo.message.content`)

## Multi-conversation

1. `useXConversations` holds the list + active key.
2. `useXChat({ conversationKey: activeConversationKey })` isolates message stores.
3. Cache **one Provider per conversation key**.
4. Use `queueRequest(newKey, params)` when the user sends while `defaultMessages` is still loading.

## Vue reactivity

Do not replace ref objects incorrectly:

```ts
// ✅
messages.value.forEach(...)
onRequest({ query })

// ❌ treating messages as a raw array in script
messages.map(...) // messages is a Ref
```

Templates unwrap refs, so `messages.map` in a template is fine.
