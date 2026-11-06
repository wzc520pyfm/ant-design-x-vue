# @ant-design-x-vue/x-card

Vue port (MVP) of [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card).

This slice covers the public surface used by a basic VitePress demo:

- `XCard.Box` / `XCard.Card`
- `registerCatalog` / `loadCatalog` / `validateComponent` / `clearCatalogCache`
- A2UI **v0.9** commands (`createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`)
- Lightweight v0.8 `surfaceUpdate` + `beginRendering` so existing command shapes type-check

Full A2UI (streaming, form validation, nested action context parity with React 2.10) is intentionally out of this PR.

```bash
pnpm add @ant-design-x-vue/x-card
```

```vue
<script setup>
import { h } from 'vue'
import { registerCatalog, XCard } from '@ant-design-x-vue/x-card'

registerCatalog({ $id: 'local://demo', catalogId: 'local://demo', components: { Text: { type: 'object' } } })

const Text = (props, { slots }) => h('p', {}, props.text ?? slots.default?.())
const commands = [
  { version: 'v0.9', createSurface: { surfaceId: 'hello', catalogId: 'local://demo' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'hello',
      components: [{ id: 'root', component: 'Text', text: 'Hello X Card' }],
    },
  },
]
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Text }">
    <XCard.Card id="hello" />
  </XCard.Box>
</template>
```
