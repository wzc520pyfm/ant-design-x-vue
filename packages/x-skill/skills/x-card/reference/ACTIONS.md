# Actions

v0.9:

```ts
action: {
  event: {
    name: 'confirm',
    context: {
      guests: { path: '/reservation/guests', label: 'Guests' },
    },
  },
}
```

When the user activates the control, Card resolves `{ path }` to `{ value, label }` and Box emits `ActionPayload`:

```ts
interface ActionPayload {
  name: string
  surfaceId: string
  context: Record<string, any>
}
```

v0.8 context is often `{ key, value: { path } }[]`. Empty context on submit still gets path resolution from the action definition.

In Vue listen with `:on-action` on `XCard.Box`. Inside a catalog component, call `onAction(name, context)` or `onAction(action.event.context)`.
