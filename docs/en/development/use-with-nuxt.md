# Use with Nuxt

Applicable to Nuxt 3 / Nuxt 4 + Vue 3.3+. The independent `nuxt-module` in the repository Roadmap is still in planning; since 1.x, the community practice is to use `unplugin-vue-components` Nuxt / Vite integration with `AntDesignXVueResolver` for on-demand automatic import (the same resolver as in [Introduction](/en/development/introduce) / [Using with Vite](/en/development/use-with-vite)).

Do not treat the React Next.js guide as a Vue step-by-step. React reference page: https://x.ant.design/docs/react/use-with-next-cn.

## Installation

::: code-group

```sh [npm]
$ npm install ant-design-vue ant-design-x-vue
$ npm install unplugin-vue-components -D
```

```sh [pnpm]
$ pnpm add ant-design-vue ant-design-x-vue
$ pnpm add -D unplugin-vue-components
```

```sh [yarn]
$ yarn add ant-design-vue ant-design-x-vue
$ yarn add -D unplugin-vue-components
```

:::

Install Markdown / SDK as needed:

```sh
npm install @ant-design-x-vue/x-markdown @ant-design-x-vue/x-sdk
```

## Configuration `nuxt.config`

### Method 1: `unplugin-vue-components/nuxt` (recommended)

```ts
// nuxt.config.ts
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver'

export default defineNuxtConfig({
  modules: ['unplugin-vue-components/nuxt'],
  components: {
    resolvers: [AntDesignXVueResolver()],
  },
})
```

### Option 2: Attach it to the Vite plugin (common in 1.x docs and community examples)

```ts
// nuxt.config.ts
import components from 'unplugin-vue-components/vite'
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver'

export default defineNuxtConfig({
  vite: {
    plugins: [
      components({
        resolvers: [AntDesignXVueResolver()],
      }),
    ],
  },
})
```

## Use in a page

Use components with the `AX` prefix; the resolver will automatically import from `ant-design-x-vue`:

```vue
<script setup lang="ts">
// 等价于 import { Bubble as AXBubble, XProvider as AXXProvider } from 'ant-design-x-vue'
</script>

<template>
  <AXXProvider>
    <AXBubble content="Hello AI" />
  </AXXProvider>
</template>
```

You can also manually import, then register the global `XProvider` in `plugins/` (as required by the project).

## Notes

- You need a runnable Vue 3.3+ Nuxt application first; under SSR, if you encounter style flickering, you can wrap `XProvider` in a client-side plugin, or handle style injection according to ant-design-vue's Nuxt practice.
- The standalone official Nuxt Module hasn’t been released yet; the above Resolver method is consistent with the 1.x documentation/examples.
- ant-design-vue itself can optionally use [`@ant-design-vue/nuxt`](https://www.npmjs.com/package/@ant-design-vue/nuxt); it does not replace the `ant-design-x-vue` resolver. Both can coexist.
