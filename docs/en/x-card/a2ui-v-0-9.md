# A2UI v0.9

> 中文：[A2UI v0.9](/x-card/a2ui-v-0-9)

v0.9 is the recommended protocol: every command carries `version: 'v0.9'` and uses explicit `createSurface` / `updateComponents` / `updateDataModel` / `deleteSurface`. See the [Introduction](/en/x-card/introduce) for the protocol overview.

The eight demos below use v0.9 commands and mirror the interaction scenarios, data, and state transitions of React `@ant-design/x-card` 2.10. They keep the Vue XCard API (`:on-action`, `useXCardField`, `registerCatalog`) instead of copying React's Bubble + XMarkdown marketing shell.

## Examples

### Basic usage

::::demo-v2 Coffee booking: register a local catalog, choose a date and coffee, then confirm. Success deletes the booking Surface and creates a result card with the coffee, date, and price.

x-card/basic

::::

### Progressive

::::demo-v2 After the welcome text streams in, eight products load in four batches. A `loading-indicator` Surface tracks progress while repeated `updateComponents` calls expand the product Surface.

x-card/progressive

::::

### Streaming

::::demo-v2 AI food recommendations: intro text streams first, then progress and four restaurants are written into the dataModel. Completion turns streaming off and shows the final summary.

x-card/streaming

::::

### Nested interaction

::::demo-v2 File tree, file detail, and accordion panels share one Surface. Selecting a file writes `/browser/selectedFile`; details and the selected state update together, and panel content is read from `/browser/panels`.

x-card/nested-interaction

::::

### Multi-card sync

::::demo-v2 A three-column product list, cart, and order summary share `/cart`. Add, quantity changes, removal, discounts, shipping, and checkout are all supported; checkout swaps in a success card.

x-card/multi-card-sync

::::

### Filter search

::::demo-v2 Ten products support keyword, multi-category, price-range, and minimum-rating filters. Filters are written to `/filters`; the result list refreshes from the same data after 300ms.

x-card/filter-search

::::

### Form validation

::::demo-v2 Multi-step registration: basic info → security → result. Fields use `useXCardField` and write through the injected `onDataChange`; final submission replaces the Surface with a success card.

x-card/form-validation

::::

### Action context resolve

::::demo-v2 Typing writes into the dataModel. A submit button may send an empty context; Card resolves `{ path }` entries in `action.event.context`. The log keeps the latest four callbacks so the resolved values are visible.

x-card/action-context

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
| catalogOptions | Catalog loading options: scoped registry, custom fetch and internal-host policy | `CatalogFetchOptions` | - |

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
