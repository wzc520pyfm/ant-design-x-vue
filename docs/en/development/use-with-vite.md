# Use with Vite

Suitable for Vue 3.3+ Vite projects. The package name is `ant-design-x-vue` (do not install React's `@ant-design/x`).

## Installation

::: code-group

```sh [npm]
$ npm install ant-design-vue ant-design-x-vue --save
```

```sh [pnpm]
$ pnpm install ant-design-vue ant-design-x-vue --save
```

```sh [yarn]
$ yarn add ant-design-vue ant-design-x-vue
```

```sh [bun]
$ bun add ant-design-vue ant-design-x-vue
```

:::

2.x will also provide Markdown and SDK related packages, install as needed:

```sh
npm install @ant-design-x-vue/x-markdown @ant-design-x-vue/x-sdk
```

## On-demand auto import

Install `unplugin-vue-components` and use the built-in `AntDesignXVueResolver` from the repository:

::: code-group

```sh [npm]
$ npm install unplugin-vue-components -D
```

```sh [pnpm]
$ pnpm install unplugin-vue-components -D
```

```sh [yarn]
$ yarn add unplugin-vue-components -D
```

```sh [bun]
$ bun add unplugin-vue-components -d
```

:::

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import components from 'unplugin-vue-components/vite'
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver'

export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [AntDesignXVueResolver()],
    }),
  ],
})
```

In templates, use components with the `AX` prefix (the resolver will automatically import them):

```vue
<script setup>
// 等价于 import { Bubble as AXBubble } from 'ant-design-x-vue'
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```

You can also explicitly import at the entry point and use it with `XProvider`:

```vue
<script setup lang="ts">
import { Bubble, XProvider } from 'ant-design-x-vue'
</script>

<template>
  <XProvider>
    <Bubble content="Hello AI" />
  </XProvider>
</template>
```

For more installation and feature instructions, see [Introduction](/en/development/introduce). The React Vite page is for reference only: https://x.ant.design/docs/react/use-with-vite-cn.
