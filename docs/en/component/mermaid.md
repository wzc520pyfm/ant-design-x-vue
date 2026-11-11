# Mermaid

Render Mermaid diagrams. Aligned with React `@ant-design/x` Mermaid (2.10).

> Standalone component. The Markdown plugin [`Mermaid`](/x-markdown/data-display) is still available; the two serve different purposes (plugin ≠ this component).

> 中文：[Mermaid 图表](/component/mermaid)

## When to use

- Render interactive Mermaid graphs with zoom, pan, and image/code views.
- Combine with XMarkdown via `components.code` to render `mermaid` fences.

## Examples

### Basic

:::demo-v2 Basic usage.

mermaid/basic

:::

### Custom header

:::demo-v2 Customize the header with `header`. Pass `null` / `false` to hide the default header.

mermaid/custom-header

:::

### Header actions

:::demo-v2 Control zoom / download / copy and custom actions with `actions`.

mermaid/header-actions

:::

### With XMarkdown

:::demo-v2 Use it as `components.code` inside Bubble + XMarkdown to render mermaid fences.

mermaid/with-xmarkdown

:::

## API

### MermaidProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Mermaid source (or default slot) | `string` | - | - |
| header | Header content; hidden when `null` / `false` | `VNode \| string \| (() => …) \| false \| null` | - | - |
| classNames | Semantic class names | `Partial\<Record<'root' \| 'header' \| 'graph' \| 'code', string\>\>` | - | - |
| styles | Semantic styles | `Partial\<Record<'root' \| 'header' \| 'graph' \| 'code', CSSProperties\>\>` | - | - |
| highlightProps | Highlighter options for the code view | `Record\<string, unknown\>` | - | - |
| config | `mermaid.initialize` config (keep the reference stable) | `MermaidConfig` | - | - |
| actions | Toolbar | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean; customActions?: ItemType[] }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` | - |
| onRenderTypeChange | View switch callback | `(value: 'image' \| 'code') => void` | - | - |
| prefixCls | Class prefix | `string` | - | - |
| rootClassName | Extra class on the root | `string` | - | - |
| style | Root style | `CSSProperties` | - | - |

### Slots

| Slot | Description |
| --- | --- |
| default | Mermaid source |
| header | Custom header |

### Mermaid Ref

| Prop | Description | Type |
| --- | --- | --- |
| nativeElement | Native DOM node | `HTMLElement` |

### SemanticType

| Name | Description |
| --- | --- |
| root | Root |
| header | Header container |
| graph | Graph container |
| code | Code container |

## Semantic DOM

<vp-semantic component="Mermaid"></vp-semantic>

## Design Token

| Token | Description | Default |
| --- | --- | --- |
| colorBgTitle | Title background | `colorFillContent` |
| colorTextTitle | Title text | `colorText` |
| colorBorderCode | Code block border | `colorBorderSecondary` |
| colorBorderGraph | Graph border | `colorBorderSecondary` |

## FAQ

### How do I avoid re-render / re-init when using `config`?

Keep `config` referentially stable. Do not pass an object literal in the template (such as `:config="{ theme: 'base' }"`), or every parent re-render will re-initialize Mermaid.

Preferred:

```ts
import { computed } from 'vue';

const config = computed(() => ({
  theme: isDark.value ? 'dark' : 'base',
  fontFamily: 'monospace',
}));

const CONFIG = { theme: 'base', fontFamily: 'monospace' } as const;
```

## Contributors

<doc-contributors component-name="mermaid" :max-count="50" :show-view-all="true" />
