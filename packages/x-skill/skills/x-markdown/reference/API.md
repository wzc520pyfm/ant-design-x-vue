# XMarkdown props (common)

| Prop | Notes |
| --- | --- |
| `content` / `children` | Markdown string |
| `streaming` | `boolean` or options object |
| `components` | `Record<string, Component>` |
| `plugins` | transform list |
| `config` | marked config |
| `openLinksInNewTab` | default `false` |
| `dompurifyConfig` | sanitizer |
| `escapeRawHtml` | keep raw HTML visible as text |
| `class` / `className` / `rootClassName` | root class |
| `style` | root style |
| `paragraphTag` | default `'p'` |

Custom component props include `domNode`, `streamStatus`, `children`.

Full table: https://x-vue.ant.design/x-markdown/examples
