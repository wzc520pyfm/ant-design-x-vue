# Ant Design X Vue Import Resolver

[English](./README.md) | 简体中文

## 自动引入

此文件夹包含 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 的解析器，用于实现 Ant Design X Vue 按需引入。


### 安装插件

```shell
# npm
npm i unplugin-vue-components  -D

# yarn
yarn add unplugin-vue-components -D

# pnpm
pnpm add unplugin-vue-components -D
```

### Vite 使用方法

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

### Vue CLI 使用方法

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

### 自动引入效果

```html
<script setup>
// auto import equal to
// import { Bubble } from 'ant-design-x-vue'
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```
