# X Card

`@ant-design-x-vue/x-card` is the Vue port of React [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card).

Drive dynamic cards with an A2UI command queue: `Box` holds the component registry and commands, `Card` renders a surface by `id` (`surfaceId`).

> 中文：[介绍](/x-card/introduce)

This page covers v0.9 rendering, path binding, action-context resolve, field write-back / validation, plus the React 2.10 showcase set: multi-card sync, filter-search, nested interaction, and progressive loading. v0.8 uses `surfaceUpdate` / `dataModelUpdate` / `beginRendering`.

## Install

```bash
pnpm add @ant-design-x-vue/x-card
```

## Examples

### Basic

::::demo-v2 Register a local catalog and render a Text card with v0.9 commands.

x-card/basic

::::

### Action context resolve

::::demo-v2 Typing writes into the dataModel. A submit button may send an empty context; Card resolves `{ path }` entries in `action.event.context`.

x-card/action-context

::::

### Streaming / incremental JSON

::::demo-v2 Append `updateDataModel` commands to stream incomplete text and lists into the same surface.

x-card/streaming

::::

### Form field validation

::::demo-v2 Custom fields use `useXCardField` for required / format checks and write back through the injected `onDataChange`.

x-card/form-validation

::::

### Multi-card sync

::::demo-v2 The product list and cart bind the same `/cart`. `onAction` appends `updateDataModel` so both cards refresh — no extra cross-surface protocol.

x-card/multi-card-sync

::::

### Filter search

::::demo-v2 Filters are written to `/filters`. The list reads that path and filters locally.

x-card/filter-search

::::

### Nested interaction

::::demo-v2 Clicking a file writes the selection into the dataModel. The detail card binds `/selectedFile`.

x-card/nested-interaction

::::

### Progressive loading

::::demo-v2 Batched `updateComponents` appends product nodes. The progress bar is a `LoadingIndicator` driven by props; enter animation stays inside the card with CSS.

x-card/progressive

::::

### v0.8 basic render

::::demo-v2 `surfaceUpdate` + `dataModelUpdate` (`valueString` / `literalString`) + `beginRendering`.

x-card/v08-basic

::::

### v0.8 action context

::::demo-v2 v0.8 `action.context` is `{ key, value: { path } }[]`. Input writes the dataModel; an empty-context submit is resolved by Card.

x-card/v08-action

::::

## API

### XCard.Box

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| commands | A2UI command queue | `(XAgentCommand_v0_9 \| XAgentCommand_v0_8)[]` | `[]` |
| components | Implementation map; names must be capitalized | `Record<string, Component>` | - |
| onAction | Fired when a card triggers an action | `(payload: ActionPayload) => void` | - |

### XCard.Card

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| id | surfaceId, matching the command `surfaceId` | `string` | - |

Custom components receive:

- `onAction(name, context)`: Card then runs versioned `extractDataUpdates` and resolves path refs in the action context
- `onDataChange(path, value)`: writes the current surface dataModel directly

### useXCardField

```ts
const field = useXCardField({
  path: '/form/email',
  onDataChange, // injected by Card
  rules: [{ required: true }, { pattern: /.+@.+/, message: 'Invalid email' }],
})
field.setValue(next)
field.validate()
field.error.value
```

`validateFieldValue(value, rules)` is also exported.

### Catalog helpers

- `registerCatalog(catalog)`
- `loadCatalog(catalogId)`
- `validateComponent(catalog, name, props)`
- `clearCatalogCache()`
