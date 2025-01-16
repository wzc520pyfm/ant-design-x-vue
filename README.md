# Ant Design X Vue

[![NPM version](https://img.shields.io/npm/v/ant-design-x-vue.svg?style=flat)](https://npmjs.org/package/ant-design-x-vue)
[![NPM downloads](http://img.shields.io/npm/dm/ant-design-x-vue.svg?style=flat)](https://npmjs.org/package/ant-design-x-vue)

Ant Design X For Vue.（WIP） 疯狂研发中🔥

这里是[Ant Design X](https://github.com/ant-design/x)的Vue实现。

## Usage

First, install `ant-design-vue` and `ant-design-x-vue`:

> pnpm add ant-design-vue ant-design-x-vue

Then, introduce component:

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

## Contributing

您的贡献至关重要！

现在Ant Desgin X Vue正在全力同步[Ant Design X](https://github.com/ant-design/x) 的组件，因此，协助我们同步组件是最好的贡献方式，在开始您的工作前，请遵照如下流程：
1. 在[Roadmap](https://github.com/wzc520pyfm/ant-design-x-vue/issues/1)中提及@wzc520pyfm认领一个组件，在得到答复后开始工作
2. Fork本仓库，并为你认领的组件创建一个开发分支，分支名和commit请遵守《通用提交规范》，建议在完成一个阶段性工作时就进行一次commit，不建议单个commit积累太多内容。
3. 目前完成一个新组件的大致工作如下（可参考`bubble`组件）：
    1. 对照react版本同步组件代码为Vue，尽量保障目录一致、代码结构一致
    2. 编写demo，与React版demo一致
       1. demo写在 docs/example/[component]/*目录下
    3. 编写文档，与React版一致
       1. 文档写在docs/component/*目录下
    4. 提交pr到本仓库main分支，等待审核

除此之外，我们仍有很多事要做，您也可以参考Roadmap，从中挑选您感兴趣的部分。

## Contributors

<a href="https://github.com/wzc520pyfm/ohcolor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=wzc520pyfm/ohcolor" />
</a>

## LICENSE

MIT
