# A2UI v0.9

> 中文：[A2UI v0.9](/x-card/a2ui-v-0-9)

v0.9 is the recommended protocol: every command carries `version: 'v0.9'` and uses explicit `createSurface` / `updateComponents` / `updateDataModel` / `deleteSurface`. See the [Introduction](/en/x-card/introduce) for the protocol overview.

The demos below all use v0.9 commands. They cover the same showcase names as React `@ant-design/x-card` 2.10 (basic, progressive, streaming, nested interaction, multi-card sync, filter search, form validation, action-context resolve). Vue does not ship a second v0.8 command variant of each showcase.

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

## API

Bind **`:on-action`** in templates — it is a prop, not an emit.

### XCard.Box

Box is the container that owns Card instances and dispatches commands. Place `XCard.Card` in the default slot.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| commands | A2UI command objects | `(A2UICommand_v0_9 \| XAgentCommand_v0_8)[]` | `[]` |
| components | Implementation map; names must start with an uppercase letter | `Record<string, Component>` | - |
| onAction | Fired when a card triggers an action | `(payload: ActionPayload) => void` | - |

### XCard.Card

Renders a single Surface.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| id | Surface ID, matching `surfaceId` in commands | `string` | - |

Custom components receive:

- `onAction(name, context)`: Card then runs versioned `extractDataUpdates` and resolves path refs in the action context
- `onDataChange(path, value)`: writes the current surface dataModel directly

### ActionPayload

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| name | Event name | `string` | - |
| surfaceId | The surfaceId that triggered the action | `string` | - |
| context | Context from the component, with path references resolved | `Record<string, any>` | - |

### Action context path resolution

When a component triggers an action, X Card resolves path references in the context to real values.

#### Path reference format

Use `{ path: string }` to bind dataModel values in the action config:

```json
{
  "id": "submit-btn",
  "component": "Button",
  "action": {
    "event": {
      "name": "agent:send_context_text",
      "context": {
        "username": { "path": "/form/username", "label": "Username" },
        "email": { "path": "/form/email", "label": "Email" }
      }
    }
  }
}
```

#### Resolution result

```json
{
  "username": { "value": "John", "label": "Username" },
  "email": { "value": "john@example.com", "label": "Email" }
}
```

**Note**:

- Only values that are themselves `{ path: "xxx" }` are converted
- Actual values passed by the component (for example `{ value: "actual_value" }`) are not rewritten
- Other properties (such as `label`) are kept; only `path` is replaced with `value`

### A2UICommand_v0_9

`XAgentCommand_v0_9` is an alias of `A2UICommand_v0_9`.

#### CreateSurfaceCommand

Create a new Surface.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| version | Version number | `'v0.9'` | - |
| createSurface.surfaceId | Surface ID | `string` | - |
| createSurface.catalogId | Component catalog URL or local identifier | `string` | - |

#### UpdateComponentsCommand

Update components on a Surface.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| version | Version number | `'v0.9'` | - |
| updateComponents.surfaceId | Surface ID | `string` | - |
| updateComponents.components | Component list | `BaseComponent_v0_9[]` | - |

#### BaseComponent_v0_9

```ts
interface BaseComponent_v0_9 {
  id: string
  component: string
  child?: string
  children?: string[]
  [key: string]: any | PathValue
}
```

#### UpdateDataModelCommand

Update the data model.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| version | Version number | `'v0.9'` | - |
| updateDataModel.surfaceId | Surface ID | `string` | - |
| updateDataModel.path | Data path | `string` | - |
| updateDataModel.value | Data value | `any` | - |

#### DeleteSurfaceCommand

Delete a Surface.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| version | Version number | `'v0.9'` | - |
| deleteSurface.surfaceId | Surface ID | `string` | - |

### PathValue

```ts
interface PathValue {
  path: string
}
```

### Catalog

```ts
interface Catalog {
  $schema?: string
  $id?: string
  title?: string
  description?: string
  catalogId?: string
  components?: Record<string, CatalogComponent>
  functions?: Record<string, any>
  $defs?: Record<string, any>
}
```

### CatalogComponent

```ts
interface CatalogComponent {
  type: 'object'
  allOf?: any[]
  properties?: Record<string, any>
  required?: string[]
  [key: string]: any
}
```

### Catalog helpers

```ts
registerCatalog(catalog: Catalog): void
loadCatalog(catalogId: string): Promise<Catalog>
validateComponent(catalog: Catalog, componentName: string, componentProps: Record<string, any>): boolean
clearCatalogCache(): void
```

### useXCardField

A Vue-only composable for field write-back and validation (used by the form-validation demo).

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
