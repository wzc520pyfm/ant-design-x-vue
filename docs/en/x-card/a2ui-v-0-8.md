# A2UI v0.8

> 中文：[A2UI v0.8](/x-card/a2ui-v-0-8)

v0.8 is the compatibility protocol: commands have no `version` field, and the first update implicitly creates a Surface. Prefer [A2UI v0.9](/en/x-card/a2ui-v-0-9) for new work.

Vue currently ships two v0.8 demos (basic render and action context). The fuller React 2.10 showcase set (progressive loading, streaming, multi-card sync, and so on) is implemented here with v0.9 commands — see [A2UI v0.9](/en/x-card/a2ui-v-0-9).

## Examples

### Basic render

::::demo-v2 `surfaceUpdate` + `dataModelUpdate` (`valueString` / `literalString`) + `beginRendering`.

x-card/v08-basic

::::

### Action context

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
