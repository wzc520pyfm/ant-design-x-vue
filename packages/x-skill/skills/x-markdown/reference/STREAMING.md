# Streaming

- Boolean `:streaming="isStreaming"` is the recommended app-level switch.
- Object form: set `hasNextChunk: false` when the LLM finishes.
- `incompleteMarkdown: 'placeholder' | 'complete'`
- `typewriter` and `enableAnimation` are independent of protocol streaming
- `tail: true` shows default `▋`; or `{ content, component }`

Pair with `useStreaming` from `@ant-design-x-vue/x-markdown` when you need helper state (see site streaming docs).
