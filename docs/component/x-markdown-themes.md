# XMarkdown 主题

主题是普通 CSS。类名挂在 `XMarkdown` 的 `className`（或 Vue 的 `class`）上。

```ts
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
```

发布包的 `themes/light.css` 和 `themes/dark.css` 对应类名 `x-markdown-light`、`x-markdown-dark`。

:::demo-v2 同一段 Markdown，左右两套主题。

x-markdown/themes

:::

自定义主题沿用同一套变量：文件名 `主题名.css`，根类名 `.x-markdown-主题名`，里面定义 `--text-color`、`--heading-color`、`--primary-color` 等。React 文档里的贡献说明同样适用，主题文件放在 `packages/x-markdown/themes/`。
