# 在 Nuxt 中使用

适用 Nuxt 3 / Nuxt 4 + Vue 3.3+。仓库 Roadmap 里的独立 `nuxt-module` 仍在规划中；1.x 起社区通用做法是通过 `unplugin-vue-components` 的 Nuxt / Vite 集成，配合 `AntDesignXVueResolver` 做按需自动导入（与 [介绍](/development/introduce) / [在 Vite 中使用](/development/use-with-vite) 同一套解析器）。

不要把 React 的 Next.js 指南当成 Vue 步骤。React 对照页：https://x.ant.design/docs/react/use-with-next-cn 。

## 安装

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

按需再装 Markdown / SDK：

```sh
npm install @ant-design-x-vue/x-markdown @ant-design-x-vue/x-sdk
```

## 配置 `nuxt.config`

### 方式一：`unplugin-vue-components/nuxt`（推荐）

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

### 方式二：挂到 Vite 插件（1.x 文档站与社区示例常用）

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

## 在页面里使用

以 `AX` 前缀使用组件，解析器会自动从 `ant-design-x-vue` 引入：

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

也可以手动 import，再在 `plugins/` 里注册全局 `XProvider`（按项目需要）。

## 注意

- 需要先有可运行的 Vue 3.3+ Nuxt 应用；SSR 下若遇到样式闪烁，可在客户端插件里包裹 `XProvider`，或按 ant-design-vue 的 Nuxt 实践处理样式注入。
- 独立官方 Nuxt Module 尚未发布；上述 Resolver 方式与 1.x 文档/示例保持一致，后续 Module 落地后会在本页补充迁移说明。
- ant-design-vue 本身可选用 [`@ant-design-vue/nuxt`](https://www.npmjs.com/package/@ant-design-vue/nuxt)；它不替代 `ant-design-x-vue` 的 Resolver，两者可并存。
