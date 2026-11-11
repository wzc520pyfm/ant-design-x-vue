# Ant Design X of Vue

`ant-design-x-vue` is a Vue UI library that follows the Ant Design system. It is the Vue implementation of `@ant-design/x`, used to build AI-driven interfaces and quickly integrate intelligent chat components and API services.

<div style="display: flex; align-items: center; gap: 20px;">
  <img width="150" src="/images/x-logo.svg"/>
  <span style="color: rgb(170, 170, 170); font-size: 30px; use-select: none;">+</span>
  <img width="160" src="/images/vue.svg"/>
</div>

## ✨ Features

- 🌈 Based on a RICH interaction paradigm, provides an excellent AI interaction experience
- 🧩 Covers most AI conversation scenarios, helping to quickly build personalized AI interaction pages
- ⚡ Easily connect to model inference services that comply with OpenAI standards
- 🔄 Provides convenient data flow management features for more efficient development
- 📦 Provides multiple templates for quickly starting LUI application development
- 🛡 Developed with TypeScript, providing complete type support to enhance development experience and reliability
- 🎨 Supports fine-grained style adjustments to meet personalized needs in various scenarios

## Installation

> [!IMPORTANT]
> Ensure your Vue version is greater than or equal to 3.3

### Install with npm, yarn, pnpm, or bun

::: code-group

```sh [npm]
$ npm install ant-design-x-vue --save
```

```sh [pnpm]
$ pnpm install ant-design-x-vue --save
```

```sh [yarn]
$ yarn add ant-design-x-vue
```

```sh [bun]
$ bun add ant-design-x-vue
```

:::

### Browser usage

In the browser, use `script` and `link` tags to directly include files and use the global variable `antdx`.

<span style="display: flex;gap: 4px;align-items: center;">You can download it via [![](https://data.jsdelivr.com/v1/package/npm/ant-design-x-vue/badge)](https://www.jsdelivr.com/package/npm/ant-design-x-vue) or [UNPKG](https://unpkg.com/ant-design-x-vue/dist/).</span>

Raw HTML online examples without any build: [CodePen Example >](https://codepen.io/wzc520pyfm/pen/vEOVQLa)

Most modern browsers natively support ES modules, and you can also enable [Import Maps](https://caniuse.com/import-maps): [CodePen Example >](https://codepen.io/wzc520pyfm/pen/gbpBQLq)

### Auto import

To automatically import components in the project, you need to use the `unplugin-vue-components` plugin. If it is not installed, you can install it using the following command:

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

In the `Vite` or `Webpack` configuration file, add the following dependencies and plugins:

::: code-group

```js [vite.config.js]
// vite.config.js
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// add the following dependencies
import components from 'unplugin-vue-components/vite';
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver';

export default defineConfig({
  // ...
  plugins: [
    // add the following plugin
    components({
      resolvers: [AntDesignXVueResolver()],
    }),
  ],
});
```

```js [webpack.config.js]
// webpack.config.js

// add the following dependencies
const Components = require('unplugin-vue-components/webpack');
const { AntDesignXVueResolver } = require('ant-design-x-vue/resolver');

module.exports = {
  configureWebpack: {
    plugins: [
      // add the following plugin
      Components.default({
        resolvers: [AntDesignXVueResolver()],
      }),
    ],
  },
};
```

:::

For more examples with other bundling tools, refer to [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components#installation)

In the project, components starting with `AX` will be automatically resolved as `ant-design-x-vue` components and imported into the files, and you can directly use them in templates:

```html
<script setup>
  // auto import equals to
  // import { Bubble as AXBubble } from 'ant-design-x-vue';
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```

## 🧩 Atomic components

Based on the RICH interaction paradigm, we provide a large number of atomic components at different interaction stages to help you flexibly build your AI chat applications:

- General: `Bubble` - message bubble, `Conversations` - conversation management, `Notification` - system notifications
- Activation: `Welcome` - welcome, `Prompts` - prompt collection
- Expression: `Attachments` - input attachments, `Sender` - send box, `Suggestion` - quick commands
- Confirmation: `Think` - thinking process, `ThoughtChain` - thought chain, `Sources` - source references
- Feedback: `Actions` - action list, `FileCard` - file card
- Others: `XProvider` - global settings: theme, internationalization, etc.

Groups are consistent with `@ant-design/x@2.10.0`; see the overview at [Components](/en/component/overview).

## ⚡️ Connect model/agent services and manage AI conversation data flow

By providing the X SDK (`@ant-design-x-vue/x-sdk`), we help you connect to model and agent services out of the box and provide useful basic tools. These symbols are directly exported from `ant-design-x-vue`. Upgrade steps can be found at [From v1 to v2](/en/development/migration-v2). Fields and examples are in [X SDK](/en/x-sdk/introduce).

- `XRequest`: general HTTP requests + streaming response parsing
- `XStream`: SSE streaming data parsing based on Web Streams
- `useXChat`: AI chat state management, used with `ChatProvider` to adapt to various model APIs
- `useXConversations`: session list and switching state management
- `XMCPClient`: MCP (Model Context Protocol) client implemented based on `XRequest`

## ✨ High-performance streaming Markdown engine

We provide X Markdown (`@ant-design-x-vue/x-markdown`) rendering solution optimized for streaming content:

- Streaming incremental buffering: Automatically identify unfinished markdown tokens (links, pictures, tables, HTML, etc.) to ensure that "half syntax" does not appear during rendering.
- Built-in plugins: `Latex` (based on KaTeX), `HighlightCode` (based on highlight.js), `Mermaid` (based on mermaid).
- Theme style: built-in `themes/light.css`, `themes/dark.css`, which can be introduced as needed.

The following is a code example of using atomic components to build the simplest dialog box:

```vue
<script setup lang="ts">
import {
  // 消息气泡
  Bubble,
  // 发送框
  Sender,
} from 'ant-design-x-vue';

defineOptions({ name: 'SampleChat' });

const messages = [
  {
    content: 'Hello, Ant Design X Vue!',
    role: 'user',
  },
];
</script>

<template>
  <Bubble.List :items="messages" />
  <Sender />
</template>
```

Here is an online example for reference: [Example Project](https://stackblitz.com/edit/atgajqmx?file=src%2FDemo.vue). It is also recommended to fork this example to report bugs.

::: warning

The tsx style code examples in the document are written using [`defineRender`](https://vue-macros.dev/zh-CN/macros/define-render.html). To run them, you also need to integrate [`Vue Macros`](https://vue-macros.dev/zh-CN/guide/bundler-integration.html).

The sample code of Vue template style is being updated step by step. You can switch **Style Preference** to `setup` preview in the upper left corner.

:::
