# 在 Vite 中使用

适用 Vue 3.3+ 的 Vite 项目。包名是 `ant-design-x-vue`（不要安装 React 的 `@ant-design/x`）。

## 安装

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

2.x 还会一并提供 Markdown 与 SDK 相关包，按需安装：

```sh
npm install @ant-design-x-vue/x-markdown @ant-design-x-vue/x-sdk
```

## 按需自动导入

安装 `unplugin-vue-components`，并使用仓库自带的 `AntDesignXVueResolver`：

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

模板里以 `AX` 前缀使用组件即可（解析器会自动引入）：

```vue
<script setup>
// 等价于 import { Bubble as AXBubble } from 'ant-design-x-vue'
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```

也可以在入口显式引入并配合 `XProvider`：

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

更多安装与特性说明见 [介绍](/development/introduce)。React 的 Vite 页仅作对照：https://x.ant.design/docs/react/use-with-vite-cn 。
