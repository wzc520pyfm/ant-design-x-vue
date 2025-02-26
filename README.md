# Ant Design X Vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![Github Actions][github-actions-src]][github-actions-href]
![Netlify Build][netlify-build-src]
[![License][license-src]][license-href]

Ant Design X For Vue. 🔥

这里是[Ant Design X](https://github.com/ant-design/x)的Vue实现。

## Usage

First, install packages `ant-design-vue` and `ant-design-x-vue` to you project, you can run below commands in your project directory:

> pnpm add ant-design-vue ant-design-x-vue

Second, import components from lib ant-design-x-vue:

```ts
<script setup lang="ts">
import { Bubble, XProvider } from 'ant-design-x-vue';
</script>

<template>
  <Bubble content="Hello AI" />
</template>
```

## Development

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

## Links

* [Vue](https://vuejs.org/)

* [Ant Design Vue](https://www.antdv.com/)

* [Ant Design X Of React](https://x.ant.design/)

## Contributing

您的贡献至关重要！
Would you like to change the world with us?

您可以参考[Roadmap](https://github.com/wzc520pyfm/ant-design-x-vue/issues/1)，从中挑选您感兴趣的部分。
Please reference the [Roadmap](https://github.com/wzc520pyfm/ant-design-x-vue/issues/1) and pick up any one you like.

## Contributors

<a href="https://github.com/wzc520pyfm/ant-design-x-vue/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=wzc520pyfm/ant-design-x-vue" />
</a>

## LICENSE

MIT

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/ant-design-x-vue.svg?style=flat
[npm-version-href]: https://npmjs.com/package/ant-design-x-vue
[npm-downloads-src]: https://img.shields.io/npm/dm/ant-design-x-vue.svg?style=flat
[npm-downloads-href]: https://npmjs.com/package/ant-design-x-vue
[bundle-src]: https://img.shields.io/bundlephobia/minzip/ant-design-x-vue?style=flat
[bundle-href]: https://bundlephobia.com/result?p=ant-design-x-vue
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/wzc520pyfm/ant-design-x-vue/ci.yml?branch=main&style=flat
[github-actions-href]: https://github.com/wzc520pyfm/ant-design-x-vue/actions?query=workflow%3Aci
[netlify-build-src]: https://img.shields.io/netlify/cb006e4e-afce-4c3e-9652-6f8a065b5b6e
[license-src]: https://img.shields.io/github/license/wzc520pyfm/ant-design-x-vue?style=flat
[license-href]: https://github.com/wzc520pyfm/ant-design-x-vue/blob/main/LICENSE
