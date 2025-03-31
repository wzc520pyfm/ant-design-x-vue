# Ant Design X Vue Import Resolver

English | [简体中文](./README.zh-CN.md)

## Automatic Import

This folder includes a resolver for [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) that enables on-demand importing of Ant Design X Vue components.


### Install Plugin

```shell
# npm
npm i unplugin-vue-components  -D

# yarn
yarn add unplugin-vue-components -D

# pnpm
pnpm add unplugin-vue-components -D
```

### Vite

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [AntDesignXVueResolver()]
    })
  ]
})
```

### Vue CLI

```js
// vue.config.js
const Components = require('unplugin-vue-components/webpack')
const { AntDesignXVueResolver } = require('ant-design-x-vue/resolver')

module.exports = {
  configureWebpack: {
    plugins: [
      Components.default({
        resolvers: [AntDesignXVueResolver()]
      })
    ]
  }
}
```

### Auto import
```html
<script setup>
// auto import equal to
// import { Bubble } from 'ant-design-x-vue'
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```