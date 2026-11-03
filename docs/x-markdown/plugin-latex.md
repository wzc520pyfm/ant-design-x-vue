# 公式

`Latex` 从 `@ant-design-x-vue/x-markdown/plugins/Latex` 引入，返回 marked extensions，传给 `config.extensions`。行内 `$...$` / `\(...\)`，块级 `$$` / `\[...\]`。

## 何时使用

需要在 Markdown 中渲染数学公式时。

## 代码演示

:::demo-v2 基础公式。

x-markdown/latex

:::

:::demo-v2 流式公式。

x-markdown/latex-streaming

:::

## API

`Latex(options?)` 返回 `TokenizerAndRendererExtension[]`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| replaceAlignStart | 是否把公式里的 `align*` 换成 `aligned`。[KaTeX 不支持 `align*`](https://github.com/KaTeX/KaTeX/issues/1007) | `boolean` | `true` |
| katexOptions | 原样交给 KaTeX 的配置 | [`KatexOptions`](https://katex.org/docs/options) | `{ output: 'html', throwOnError: false }` |

```ts
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Latex from '@ant-design-x-vue/x-markdown/plugins/Latex';

// <XMarkdown :config="{ extensions: Latex({ replaceAlignStart: true }) }" content="$E=mc^2$" />
```

更多说明见 [插件集 · Latex](/x-markdown/plugins)。
