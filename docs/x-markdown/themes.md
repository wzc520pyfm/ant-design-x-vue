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

## 自定义主题

Vue 不用 cssinjs。可以在页面里加一层 class，覆盖标题、段落等样式；也可以按贡献规范在 `packages/x-markdown/themes/` 新增 `主题名.css`，根类名 `.x-markdown-主题名`，定义 `--text-color`、`--heading-color`、`--primary-color` 等。

:::demo-v2 页面级自定义样式覆盖 light 主题。

x-markdown/themes-custom

:::
