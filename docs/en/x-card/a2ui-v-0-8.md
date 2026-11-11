# A2UI v0.8

> 中文：[A2UI v0.8](/x-card/a2ui-v-0-8)

v0.8 is the compatibility protocol: commands have no `version` field, and the first update implicitly creates a Surface. Prefer [A2UI v0.9](/en/x-card/a2ui-v-0-9) for new work.

The eight demos below mirror the React `@ant-design/x-card` 2.10 v0.8 showcase set: coffee booking, progressive loading, streaming recommendations, file browser, multi-card cart, filter search, multi-step registration, and action-context resolution. Each scenario uses native v0.8 commands (`surfaceUpdate` / `dataModelUpdate` / `beginRendering`).

## Examples

### Basic usage

::::demo-v2 Coffee booking: choose a date and coffee, then confirm the order. Commands run in `surfaceUpdate` → `dataModelUpdate` → `beginRendering` order; on success the booking Surface is deleted and a result card is rendered.

x-card/v08-basic

::::

### Progressive

::::demo-v2 Two coordinated Surfaces: `loading-indicator` shows progress while the product Surface appends two products per batch through repeated `surfaceUpdate` calls.

x-card/v08-progressive

::::

### Streaming

::::demo-v2 Food recommendations. Intro text streams first, then `dataModelUpdate` writes progress and restaurant lists incrementally so cards appear as progress advances.

x-card/v08-streaming

::::

### Nested interaction

::::demo-v2 File tree, file detail, and accordion panels. Selecting a file writes `selectedFile` into the dataModel; the detail card follows the same path, while panel data is stored as JSON strings in `valueMap`.

x-card/v08-nested-interaction

::::

### Multi-card sync

::::demo-v2 Product list, cart, and order summary share `/cart`. Add, quantity changes, removal, and checkout all update the dataModel, then switch to a success Surface.

x-card/v08-multi-card-sync

::::

### Filter search

::::demo-v2 Keyword, categories, price range, and minimum rating are written to `/filters`. The panel and result list read the same data and refresh after a short delay.

x-card/v08-filter-search

::::

### Form validation

::::demo-v2 Multi-step registration: basic info → security → result. Fields validate locally and write `formData` through the action context; the registration Surface is replaced by the result card.

x-card/v08-form-validation

::::

### Action context resolve

::::demo-v2 v0.8 `action.context` is `{ key, value: { path } }[]`. Input writes the dataModel; an empty-context submit is resolved by Card.

x-card/v08-action

::::

## API

`XCard.Box` / `XCard.Card` are shared across protocol versions. The tables below document the v0.8 command shapes. Bind **`:on-action`** in templates — it is a prop, not an emit.

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

- `onAction(name, context)`: Card then resolves path references according to the protocol version
- `onDataChange(path, value)`: writes the current surface dataModel directly

### ActionPayload

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| name | Event name | `string` | - |
| surfaceId | The surfaceId that triggered the action | `string` | - |
| context | Context from the component, with path references resolved | `Record<string, any>` | - |

### Action context path resolution

When a component triggers an action, X Card resolves path references in the context to real values.

#### Path reference format (v0.8)

v0.8 action configs commonly use an array to describe path bindings:

```json
{
  "id": "submit-btn",
  "component": {
    "Button": {
      "action": {
        "name": "agent:send_context_text",
        "context": [
          { "key": "username", "value": { "path": "/form/username" } },
          { "key": "email", "value": { "path": "/form/email" } }
        ]
      }
    }
  }
}
```

#### Resolution result

After the user clicks the button, `onAction` receives:

```json
{
  "username": { "value": "John" },
  "email": { "value": "john@example.com" }
}
```

**Note**:

- Only values that are themselves `{ path: "xxx" }` are converted
- Actual values passed by the component are not rewritten

### XAgentCommand_v0_8

`XAgentCommand_v0_8` is an alias of `A2UICommand_v0_8` and supports the following commands.

#### SurfaceUpdateCommand

Update components on a Surface.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| surfaceUpdate.surfaceId | Surface ID | `string` | - |
| surfaceUpdate.components | Component list | `ComponentWrapper_v0_8[]` | - |

#### ComponentWrapper_v0_8

```ts
interface ComponentWrapper_v0_8 {
  id: string
  component: {
    [componentType: string]: {
      child?: string
      children?: string[] | ExplicitList
      [key: string]: any | PathValue | LiteralStringValue
    }
  }
}
```

#### ExplicitList

```ts
interface ExplicitList {
  explicitList: string[]
}
```

#### DataModelUpdateCommand

Update the data model (v0.8 format).

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| dataModelUpdate.surfaceId | Surface ID | `string` | - |
| dataModelUpdate.contents | Data content list | `Array<{ key: string; valueString?: string; valueMap?: Array<{ key: string; valueString: string }> }>` | - |

#### BeginRenderingCommand

Begin rendering.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| beginRendering.surfaceId | Surface ID | `string` | - |
| beginRendering.root | Root component ID | `string` | - |

#### DeleteSurfaceCommand

Delete a Surface.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| deleteSurface.surfaceId | Surface ID | `string` | - |

### PathValue

```ts
interface PathValue {
  path: string
}
```

### LiteralStringValue

Literal string value (v0.8 specific).

```ts
interface LiteralStringValue {
  literalString: string
}
```
