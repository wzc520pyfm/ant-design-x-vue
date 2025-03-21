# Ant Design X Vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![Github Actions][github-actions-src]][github-actions-href]
![Netlify Build][netlify-build-src]
[![License][license-src]][license-href]

[![](https://data.jsdelivr.com/v1/package/npm/ant-design-x-vue/badge)](https://www.jsdelivr.com/package/npm/ant-design-x-vue)

Ant Design X For Vue. 🔥 [English](./README.en.md)

这里是[Ant Design X](https://github.com/ant-design/x)的Vue实现。

## ✨ 特性

- 🌈 基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ 轻松对接符合 OpenAI 标准的模型推理服务
- 🔄 提供好用的数据流管理功能，让开发更高效
- 📦 提供多种模板，快速启动 LUI 应用开发
- 🛡 采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 支持细粒度的样式调整，满足各种场景的个性化需求


## Usage

安装两个依赖 `ant-design-vue` and `ant-design-x-vue` 到你的项目中, 你可以参照如下命令行：

> pnpm add ant-design-vue ant-design-x-vue

然后在你的项目里导入 `ant-design-vue`:

```ts
<script setup lang="ts">
import { Bubble, XProvider } from 'ant-design-x-vue';
</script>

<template>
  <Bubble content="Hello AI" />
</template>
```

## 开发

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm docs:dev

# build library source code
$ pnpm run build

# build docs code
$ pnpm run docs:build

# Locally preview the production build.
$ pnpm run docs:preview

# Lint
$ pnpm lint
```

## 链接

* [Vue](https://vuejs.org/)

* [Ant Design Vue](https://www.antdv.com/)

* [Ant Design X Of React](https://x.ant.design/)

## Contributing

您的贡献至关重要！

您可以参考[Roadmap](https://github.com/wzc520pyfm/ant-design-x-vue/issues/1)，从中挑选您感兴趣的部分。

## 贡献者

<a href="https://github.com/wzc520pyfm/ant-design-x-vue/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=wzc520pyfm/ant-design-x-vue" />
</a>

## 交流

### 微信公众号
![Ant-Design-X Vue](./docs/public/images//wechat_public_account.jpg)

### QQ 群
![QQ 群](./docs/public/images/QQ_group_1.jpg)

## LICENSE

MIT

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/ant-design-x-vue.svg?style=flat
[npm-version-href]: https://npmjs.com/package/ant-design-x-vue
[npm-downloads-src]: https://img.shields.io/npm/dt/ant-design-x-vue.svg?style=flat
[npm-downloads-href]: https://npmjs.com/package/ant-design-x-vue
[bundle-src]: https://img.shields.io/bundlephobia/minzip/ant-design-x-vue?style=flat
[bundle-href]: https://bundlephobia.com/result?p=ant-design-x-vue
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/wzc520pyfm/ant-design-x-vue/ci.yml?branch=main&style=flat
[github-actions-href]: https://github.com/wzc520pyfm/ant-design-x-vue/actions?query=workflow%3Aci
[netlify-build-src]: https://img.shields.io/netlify/cb006e4e-afce-4c3e-9652-6f8a065b5b6e
[license-src]: https://img.shields.io/github/license/wzc520pyfm/ant-design-x-vue?style=flat
[license-href]: https://github.com/wzc520pyfm/ant-design-x-vue/blob/main/LICENSE
