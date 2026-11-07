# LaTeX

`Latex` is imported from `@ant-design-x-vue/x-markdown/plugins/Latex`, returns marked extensions, and is passed to `config.extensions`. Inline `$...$` / `\(...\)`, block `$$` / `\[...\]`.

## When to use

Needed when rendering mathematical formulas in Markdown.

## Examples

:::demo-v2 Basic formulas.

x-markdown/latex

:::

:::demo-v2 Streaming formulas.

x-markdown/latex-streaming

:::

## API

`Latex(options?)` returns `TokenizerAndRendererExtension[]`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| replaceAlignStart | Whether to replace `align*` in formulas with `aligned`. [KaTeX does not support `align*`](https://github.com/KaTeX/KaTeX/issues/1007) | `boolean` | `true` |
| katexOptions | Configuration passed directly to KaTeX | [`KatexOptions`](https://katex.org/docs/options) | `{ output: 'html', throwOnError: false }` |

```ts
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Latex from '@ant-design-x-vue/x-markdown/plugins/Latex';

// <XMarkdown :config="{ extensions: Latex({ replaceAlignStart: true }) }" content="$E=mc^2$" />
```

For more instructions, see [Plug-in Collection · Latex](/en/x-markdown/plugins).
