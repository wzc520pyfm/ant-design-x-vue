# Think 思考过程

展示大模型深度思考过程。

## 何时使用

- 用于在对话时展示大模型的深度思考过程。

## 代码演示

### 基础用法

:::demo-v2 基础用法。

think/basic

:::

### 设置状态

:::demo-v2 可自定义状态文本和图标。

think/status

:::

### 是否展开

:::demo-v2 控制展开折叠状态。

think/expand

:::

## API

### ThinkProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 样式类名 | `Record<SemanticDOM, string>` | - | - |
| styles | 样式 style | `Record<SemanticDOM, CSSProperties>` | - | - |
| title | 状态文本 | `VNode \| string` | - | - |
| icon | 状态图标 | `VNode` | - | - |
| loading | 加载中 | `boolean \| VNode` | `false` | - |
| defaultExpanded | 默认是否展开 | `boolean` | `true` | - |
| expanded | 是否展开 | `boolean` | - | - |
| onExpand | 展开事件 | `(expand: boolean) => void` | - | - |
| blink | 闪动模式 | `boolean` | - | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 思考内容 |
| title | 自定义状态文本 |
| icon | 自定义状态图标 |

### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| status | 状态区 |
| content | 内容区 |
