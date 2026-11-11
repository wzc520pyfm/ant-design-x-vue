---
name: x-card
version: 2.10.0
description: Build AI-driven UIs with @ant-design-x-vue/x-card — XCard.Box, XCard.Card, A2UI v0.9 commands, data binding, catalogs, actions. Vue SFCs only.
---

# Skill Positioning

`@ant-design-x-vue/x-card` is the Vue renderer for the A2UI protocol. Agents stream JSON commands; the client renders native Vue components.

Covers:

- `XCard.Box` + `XCard.Card`
- A2UI v0.9: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`
- Catalogs, JSON Pointer binding, actions, streaming append
- v0.8 compatibility (`surfaceUpdate` / `dataModelUpdate` / `beginRendering` in Vue demos)

> Prefer v0.9 for new work. Always include `"version": "v0.9"` on every v0.9 command.

# Package

```bash
npm install @ant-design-x-vue/x-card
```

```ts
import {
  XCard,
  registerCatalog,
  loadCatalog,
  validateComponent,
  clearCatalogCache,
  useXCardField,
  validateFieldValue,
} from '@ant-design-x-vue/x-card'
import type {
  XAgentCommand_v0_9,
  XAgentCommand_v0_8,
  ActionPayload,
  Catalog,
} from '@ant-design-x-vue/x-card'
```

`XCard.Box` owns the catalog map and command dispatch. `XCard.Card` renders one `surfaceId`.

Custom catalog component **names must start with an uppercase letter**.

# Architecture

```
XCard.Box   commands / components / onAction
 └── XCard.Card id="surface-a"
 └── XCard.Card id="surface-b"
```

`components` is passed to **Box**, not Card. Keep that map stable (module-level constant).

# Minimal Vue example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { XCard, registerCatalog } from '@ant-design-x-vue/x-card'
import type { XAgentCommand_v0_9, ActionPayload, Catalog } from '@ant-design-x-vue/x-card'

const catalog: Catalog = {
  catalogId: 'local://my_catalog.json',
  components: {
    Text: {
      type: 'object',
      properties: { text: { type: 'string' }, variant: { type: 'string' } },
      required: ['text'],
    },
    Button: {
      type: 'object',
      properties: { text: { type: 'string' }, action: {} },
      required: ['text'],
    },
  },
}
registerCatalog(catalog)

const Text = {
  props: ['text', 'variant'],
  template: '<p :class="`text-${variant || \'body\'}`">{{ text }}</p>',
}

const Button = {
  props: ['text', 'onAction', 'action'],
  setup(props: any) {
    const onClick = () => props.onAction?.(props.action?.event?.context ?? {})
    return { onClick }
  },
  template: '<button type="button" @click="onClick">{{ text }}</button>',
}

// Keep this object identity stable.
const cardComponents = { Text, Button }

const commands = ref<XAgentCommand_v0_9[]>([
  { version: 'v0.9', createSurface: { surfaceId: 'welcome', catalogId: 'local://my_catalog.json' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'welcome',
      components: [
        { id: 'root', component: 'Column', children: ['title', 'btn'] },
        { id: 'title', component: 'Text', text: { path: '/user/name' }, variant: 'h1' },
        {
          id: 'btn',
          component: 'Button',
          text: 'Start',
          action: { event: { name: 'start', context: {} } },
        },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'welcome', path: '/user/name', value: 'Alice' } },
])

function handleAction(payload: ActionPayload) {
  // payload.context already has { path } resolved to { value }
  commands.value = [...commands.value /* , ...nextCommands */]
}
</script>

<template>
  <XCard.Box :commands="commands" :components="cardComponents" :on-action="handleAction">
    <XCard.Card id="welcome" />
  </XCard.Box>
</template>
```

In Vue templates the Box action listener is `:on-action` (prop `onAction`). Custom field components receive injected `onAction(name, context)` and `onDataChange(path, value)`.

# Development rules

- Every v0.9 command includes `"version": "v0.9"`
- Exactly one component `id: "root"` per surface
- Flat adjacency list — children are id strings, never nested component objects
- Structure via `updateComponents`, state via `updateDataModel`
- `registerCatalog()` before mount
- Pass `components` to Box; do not recreate the map each render
- Two-way inputs need `value: { path: "..." }`
- Streaming: **append** commands, do not replace the whole array if you want incremental apply
- Action context `{ path }` values are resolved by Card into `{ value }` in `ActionPayload`
- Import `@ant-design-x-vue/x-card`, not `@ant-design/x-card`
- Vue SFC / `h()`, `class`, `@click` — not JSX / `className`

`useXCardField({ path, onDataChange, rules })` validates and writes back through `onDataChange`.

# Read next

- [USAGE.md](reference/USAGE.md)
- [COMMANDS.md](reference/COMMANDS.md)
- [DATA_BINDING.md](reference/DATA_BINDING.md)
- [ACTIONS.md](reference/ACTIONS.md)
- [CATALOG.md](reference/CATALOG.md)
- [API.md](reference/API.md)
- Site: https://x-vue.ant.design/x-card/introduce
- Spec: https://a2ui.org/specification/v0.9-a2ui/
