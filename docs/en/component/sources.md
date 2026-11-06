# Sources

Data source references used to display AI response content.

## Examples

### Basic usage

:::demo-v2 Basic usage.

sources/basic

:::

### Show icon

:::demo-v2 Show an icon and choose expand-icon placement.

sources/icon

:::

### Control expand/collapse

:::demo-v2 Control expand/collapse.

sources/expand

:::

### Inline mode

:::demo-v2 Show source info on hover.

sources/inline

:::

## API

### SourcesProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | Style class name prefix | `string` | - | - |
| title | Title | `VNode | string` | - | - |
| items | Data source list | `SourcesItem[]` | - | - |
| inline | Whether to use inline mode | `boolean` | `false` | - |
| expanded | Whether to Expand (Controlled) | `boolean` | - | - |
| defaultExpanded | Default Expand | `boolean` | `true` | - |
| onExpand | Expand/Fold Pullback | `(expand: boolean) => void` | - | - |
| expandIconPosition | Expand icon position | `'start' \| 'end'` | `'start'` | - |
| activeKey | Key of the current active item (inline mode) | `string \| number` | - | - |
| onClick | Click Data Source Item to Pullback | `(item: SourcesItem) => void` | - | - |
| popoverOverlayWidth | Popover Floating Card Width | `number \| string` | `300` | - |
| classNames | Semantics class | `Record\<SemanticType, string\>` | - | - |
| styles | Semanticization style | `Record\<SemanticType, CSSProperties\>` | - | - |
| rootClassName | Root class name | `string` | - | - |

### SourcesItem

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique Identifier | `string \| number` | - | - |
| title | Title | `VNode | string` | - | - |
| url | Link Address | `string` | - | - |
| icon | Icon | `VNode` | - | - |
| description | Description (displayed in inline mode) | `VNode \| string` | - | - |

### Sources Slots

| Slot | Description |
| --- | --- |
| default | Custom content (used when items are not passed) |

### Sources Ref

| Prop | Description | Type |
| --- | --- | --- |
| nativeElement | Component Root DOM Element | `HTMLDivElement` |

### SemanticType

`root` | `title` | `content`

## Semantic DOM

<vp-semantic component="Sources"></vp-semantic>

## Design Token

This component has no custom Component Token. Customize it through global Design Tokens.

