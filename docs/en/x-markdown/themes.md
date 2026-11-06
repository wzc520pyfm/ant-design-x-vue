# XMarkdown themes

The theme is normal CSS. Class names are attached to `XMarkdown`'s `className` (or Vue's `class`).

```ts
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
```

The published package's `themes/light.css` and `themes/dark.css` correspond to class names `x-markdown-light` and `x-markdown-dark`.

:::demo-v2 The same Markdown rendered with two themes.

x-markdown/themes

:::

## Custom theme

Vue does not use cssinjs. You can add a class in the page to override styles for headings, paragraphs, etc.; or you can add a theme file in `packages/x-markdown/themes/` following the contribution guidelines below.

:::demo-v2 Page-level custom styles overriding the light theme.

x-markdown/themes-custom

:::

## Contributing a theme (brief)

Contributions of new themes are welcome. Convention:

1. **File and Class Name**
- File: `packages/x-markdown/themes/<theme-name>.css`
- Root class name: `.x-markdown-<theme-name>` (for example, `ocean.css` → `.x-markdown-ocean`)

2. **Basic Variables** (refer to `light.css`)

```css
.x-markdown-ocean {
  --font-size: 14px;
  --primary-color: #0ea5e9;
  --heading-color: #0f172a;
  --text-color: #2c3e50;
  --border-color: #e2e8f0;
  --light-bg: #f1f5f9;
  --table-head-bg: #f8fafc;
  --table-body-bg: #ffffff;
  /* …其余间距 / 圆角变量与 light 对齐 */
}
```

3. **Override Element Styles**: headings, code blocks, tables, lists, blockquotes, links, etc., try to use CSS variables for easier secondary overrides.

4. **Self-Test**: In the document demo, `import '@ant-design-x-vue/x-markdown/themes/ocean.css'` and set `className="x-markdown-ocean"`.

5. **Submit**: Open a PR based on `next`, explain the theme's purpose, and update the example list on this page (if there is a separate demo).

For plugin toolbar themes/text, see [Themes and Text](/en/x-markdown/plugin-theme-locale).
