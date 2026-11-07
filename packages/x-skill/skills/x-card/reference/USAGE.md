# Usage

Register catalog → stable `components` map → `XCard.Box` + one `XCard.Card` per surface → feed `commands` (usually appended from a stream) → handle `:on-action`.

## Streaming

```ts
function pushChunk(next: XAgentCommand_v0_9[]) {
  commands.value = [...commands.value, ...next]
}
```

Do not reset the array on every chunk unless you intend a full replay.

## Multi-surface

Multiple `XCard.Card` children under one Box share `commands` but keep separate data models. To sync, write the same path from `onAction` via additional `updateDataModel` commands (see the site `multi-card-sync` demo).
