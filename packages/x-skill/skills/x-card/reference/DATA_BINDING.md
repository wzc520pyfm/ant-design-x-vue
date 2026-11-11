# Data binding

Each surface has its own JSON model. Paths are RFC 6901 JSON Pointers (`/user/name`).

```ts
// literal
{ id: 'title', component: 'Text', text: 'Welcome' }

// bound
{ id: 'username', component: 'Text', text: { path: '/user/name' } }

// two-way input
{ id: 'name-input', component: 'TextField', value: { path: '/form/name' } }
```

Custom Vue fields should call the injected `onDataChange('/form/name', nextValue)` (or `useXCardField`) so the model updates. Literal values do **not** write back.
