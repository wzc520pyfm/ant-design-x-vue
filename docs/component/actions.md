
# Actions 操作列表

用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 何时使用

Actions 组件用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 代码演示

### 基本

:::demo 基础用法。

actions/basic

:::

### 更多菜单项

:::demo 支持嵌套菜单项和自定义点击事件。

actions/sub

:::

### 使用变体

:::demo 使用 `variant` 属性来设置不同的样式变体。

actions/variant

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### ActionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | ActionItem[] | - | - |
| rootClassName | 根节点样式类 | string | - | - |
| block | 子操作项是否占据一行 | boolean | false | - |
| onClick | Item 操作项被点击时的回调函数 | `function({ item, key, keyPath, domEvent })` | - | - |
| style | 根节点样式 | CSSProperties | - | - |
| variant | 变体 | `'borderless' \| 'border'` | 'borderless' | - |
| prefixCls | 样式类名的前缀 | string | - | - |

### ItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | VNode | - | - |
| children | 子操作项 | ActionItem[] | - | - |
| triggerSubMenuAction | 触发子菜单的操作 | `'hover' \| 'click'` | 'hover' | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: ActionItem) => void | - | - |

### SubItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 自定义操作的显示标签 | string | - | - |
| key | 自定义操作的唯一标识 | string | - | - |
| icon | 自定义操作的图标 | VNode | - | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: ActionItem) => void | - | - |
| danger | 语法糖，设置危险 icon | boolean | false | - |

### ActionItem

```typescript | pure
type ActionItem = ItemType | SubItemType;
```

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Actions"></ComponentTokenTable> -->

## 贡献者

<doc-contributors component-name="actions" :max-count="50" :show-view-all="true" />

