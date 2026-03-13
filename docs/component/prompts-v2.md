# Prompts 提示集 (v2)

用于显示一组与当前上下文相关的预定义的问题或建议。

::: warning 注意
这是 v2 版本的 Prompts 组件文档，包含了新增的功能特性。如需查看 v1 版本，请访问 [Prompts 提示集](/component/prompts)。
:::

## 新功能

v2 版本新增了以下功能：

- **fadeIn** - 渐入动画效果
- **fadeInLeft** - 从左到右渐入动画效果
- **classNames.root** / **styles.root** - 根节点语义化样式支持
- **disabled 校验** - 点击回调中增加 disabled 状态校验
- **ref 暴露** - 通过 `ref` 获取组件原生 DOM 元素

## 代码演示

### 基本

<ClientOnly>

:::demo-v2 基础用法。

prompts/basic

:::

</ClientOnly>

### 不可用状态

:::demo-v2 要将 prompt 标记为禁用，请向 prompt 添加 `disabled` 属性。

prompts/disabled

:::

### 渐入效果

:::demo-v2 通过 `fadeIn` 和 `fadeInLeft` 属性控制渐入动画效果。

prompts/fadeIn

:::

### 纵向展示

:::demo-v2 使用 `vertical` 属性，控制 Prompts 展示方向。

prompts/flex-vertical

:::

### 可换行

:::demo-v2 使用 `wrap` 属性，控制 Prompts 超出区域长度时是否可以换行。

prompts/flex-wrap

:::

### 响应式宽度

:::demo-v2 配合 `wrap` 与 `styles` 固定宽度展示。

prompts/flex-wrap-fixed

:::

### 嵌套组合

<ClientOnly>

:::demo-v2 嵌套组合。

prompts/nest

:::

</ClientOnly>

## API

### PromptsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个提示项的不同部分 | Record<SemanticType, string> | - | - |
| fadeIn | 是否开启渲染渐入 | boolean | `false` | v2 |
| fadeInLeft | 是否开启渲染从左到右渐入 | boolean | `false` | v2 |
| items | 包含多个提示项的列表 | PromptProps[] | - | - |
| prefixCls | 样式类名的前缀 | string | - | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分 | Record<SemanticType, CSSProperties> | - | - |
| title | 显示在提示列表顶部的标题 | VNode \| string \| (() => VNode \| string) | - | - |
| vertical | 设置为 `true` 时, 提示列表将垂直排列 | boolean | `false` | - |
| wrap | 设置为 `true` 时, 提示列表将自动换行 | boolean | `false` | - |
| onItemClick | 提示项被点击时的回调函数 | (info: { data: PromptProps }) => void | - | - |

#### SemanticType

```typescript | pure
type SemanticType = 'root' | 'list' | 'item' | 'itemContent' | 'title' | 'subList' | 'subItem';
```

### Prompts Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 显示在提示列表顶部的标题 |

### Prompts Ref

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 组件根 DOM 元素 | HTMLDivElement |

### PromptProps

| 属性        | 说明                         | 类型            | 默认值  | 版本 |
| ----------- | ---------------------------- | --------------- | ------- | ---- |
| children    | 嵌套的子提示项               | PromptProps[]   | -       | -    |
| description | 提示描述提供额外的信息       | VNode \| string | -       | -    |
| disabled    | 设置为 `true` 时禁用点击事件 | boolean         | `false` | -    |
| icon        | 提示图标显示在提示项的左侧   | VNode | -       | -    |
| key         | 唯一标识用于区分每个提示项   | string          | -       | -    |
| label       | 提示标签显示提示的主要内容   | VNode \| string | -       | -    |

## Semantic DOM

<vp-semantic component="Prompts"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Prompts"></ComponentTokenTable> -->
