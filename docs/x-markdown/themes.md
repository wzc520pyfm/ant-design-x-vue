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

Vue 不用 cssinjs。可以在页面里加一层 class，覆盖标题、段落等样式；也可以按下面的贡献规范在 `packages/x-markdown/themes/` 新增主题文件。

:::demo-v2 页面级自定义样式覆盖 light 主题。

x-markdown/themes-custom

:::

## 贡献主题（简要）

欢迎贡献新主题。约定：

1. **文件与类名**
   - 文件：`packages/x-markdown/themes/<theme-name>.css`
   - 根类名：`.x-markdown-<theme-name>`（例如 `ocean.css` → `.x-markdown-ocean`）

2. **基础变量**（可参考 `light.css`）

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

3. **覆盖元素样式**：标题、代码块、表格、列表、引用、链接等，尽量用 CSS 变量，便于二次覆盖。

4. **自测**：在文档 demo 里 `import '@ant-design-x-vue/x-markdown/themes/ocean.css'`，并设置 `className="x-markdown-ocean"`。

5. **提交**：基于 `next` 开 PR，说明主题用途，并更新本页示例列表（如有独立 demo）。

插件工具栏的主题 / 文案见 [主题与文案](/x-markdown/plugin-theme-locale)。
