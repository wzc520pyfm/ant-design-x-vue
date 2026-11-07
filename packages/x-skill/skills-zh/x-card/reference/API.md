# API

### XCard.Box

| Prop | Type |
| --- | --- |
| commands | `(XAgentCommand_v0_9 \| XAgentCommand_v0_8)[]` |
| components | `Record<string, Component>` (uppercase names) |
| onAction | `(payload: ActionPayload) => void` — template `:on-action` |

### XCard.Card

| Prop | Type |
| --- | --- |
| id | `string` (surfaceId) |

Injected into custom components: `onAction(name, context)`, `onDataChange(path, value)`.

### useXCardField

```ts
const field = useXCardField({
  path: '/form/email',
  onDataChange,
  rules: [{ required: true }, { pattern: /.+@.+/, message: 'Invalid email' }],
})
field.setValue(next)
field.validate()
field.error.value
```

Also `validateFieldValue(value, rules)`.
