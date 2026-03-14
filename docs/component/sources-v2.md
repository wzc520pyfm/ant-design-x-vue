# Sources 引用来源 (v2)

用于展示 AI 回答内容的数据引用来源。

::: warning 注意
这是 v2 版本的 Sources 组件文档。
:::

## 代码演示

### 基本用法

:::demo-v2 基础用法。

sources/basic

:::

### 展示图标

:::demo-v2 展示图标，并可设置展开图标位置。

sources/icon

:::

### 控制展开折叠

:::demo-v2 控制展开折叠状态。

sources/expand

:::

### 内联模式

:::demo-v2 悬停时展示来源信息。

sources/inline

:::

## API

### SourcesProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | 样式类名的前缀 | `string` | - | - |
| title | 标题 | `VNode \| string` | - | - |
| items | 数据源列表 | `SourcesItem[]` | - | - |
| inline | 是否使用内联模式 | `boolean` | `false` | - |
| expanded | 是否展开（受控） | `boolean` | - | - |
| defaultExpanded | 默认是否展开 | `boolean` | `true` | - |
| onExpand | 展开/折叠回调 | `(expand: boolean) => void` | - | - |
| expandIconPosition | 展开图标位置 | `'start' \| 'end'` | `'start'` | - |
| activeKey | 当前活跃项的 key（内联模式） | `string \| number` | - | - |
| onClick | 点击数据源项回调 | `(item: SourcesItem) => void` | - | - |
| popoverOverlayWidth | Popover 悬浮卡片宽度 | `number \| string` | `300` | - |
| classNames | 语义化 class | `Record<SemanticType, string>` | - | - |
| styles | 语义化 style | `Record<SemanticType, CSSProperties>` | - | - |
| rootClassName | 根节点的样式类名 | `string` | - | - |

### SourcesItem

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - | - |
| title | 标题 | `VNode \| string` | - | - |
| url | 链接地址 | `string` | - | - |
| icon | 图标 | `VNode` | - | - |
| description | 描述（内联模式下显示） | `VNode \| string` | - | - |

### Sources Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义内容（当不传 items 时使用） |

### Sources Ref

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 组件根 DOM 元素 | `HTMLDivElement` |

### SemanticType

`root` | `title` | `content`

## Semantic DOM

<vp-semantic component="Sources"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Sources"></ComponentTokenTable> -->
