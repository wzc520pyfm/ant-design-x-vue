
# ThoughtChain 思维链

思维链组件用于可视化和追踪 Agent 对 Actions 和 Tools 的调用链。

## 何时使用

* 调试和跟踪复杂 Agent System 中的调用链
* 类似的链式场景中使用

## 代码演示

### 基本

:::demo 基础用法。

thought-chain/basic

:::

### 尺寸

:::demo ThoughtChain 有大、中、小三种尺寸。默认尺寸为中 - `middle`。

thought-chain/size

:::

### 节点状态

:::demo 思维链节点支持配置 `status` 属性来明显的表明当前节点的执行状态

thought-chain/status

:::

### 可折叠的

:::demo 配置 `collapsible` 可开启对思维链节点内容区域的折叠功能

thought-chain/collapsible

:::

### 受控模式

:::demo `collapsible` 支持传入对象，开启受控模式

thought-chain/controlled

:::

### 客制化

:::demo `items` 属性支持灵活的客制化配置，详情参考 `ThoughtChainItem` 定义

thought-chain/customization

:::

### 嵌套使用

:::demo ThoughtChain 组件支持嵌套使用

thought-chain/nested 

:::

### tooltip 提示

:::demo 配置 `tooltip` 可开启对思维链节点内容区域的 tooltip 提示功能

thought-chain/tooltip

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### ThoughtChainProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| collapsible | 是否可折叠 | boolean \| CollapsibleOptions | - | - |
| classNames | 语义化结构的类名 | Record<'item' \| 'itemHeader' \| 'itemContent' \| 'itemFooter', string> | - | - |
| items | 思维节点集合 | ThoughtChainItem[] | - | - |
| prefixCls | 自定义前缀 | string | - | - |
| rootClassName | 自定义根类名 | string | - | - |
| size | 尺寸 | 'large' \| 'middle' \| 'small' | 'middle' | - |
| styles | 语义化结构的样式 | Record<'item' \| 'itemHeader' \| 'itemContent' \| 'itemFooter', CSSProperties> | - | - |

### ThoughtChainItem

| 属性        | 说明               | 类型                              | 默认值 | 版本 |
| ----------- | ------------------ | --------------------------------- | ------ | ---- |
| content     | 思维节点内容       | VNode \| string         | -      | -    |
| description | 思维节点描述       | VNode \| string         | -      | -    |
| extra       | 思维节点额外内容   | VNode \| string          | -      | -    |
| footer      | 思维节点脚注       | VNode \| string          | -      | -    |
| icon        | 思维节点图标       | VNode                   | -      | -    |
| key         | 思维节点唯一标识符 | string                            | -      | -    |
| status      | 思维节点状态       | 'pending' \| 'success' \| 'error' | -      | -    |
| title       | 思维节点标题       | VNode \| string          | -      | -    |
| tooltip     | 思维节点 tooltip   | boolean \| TooltipConfig | -      | -    |

### CollapsibleOptions

| 属性         | 说明                   | 类型                             | 默认值 | 版本 |
| ------------ | ---------------------- | -------------------------------- | ------ | ---- |
| expandedKeys | 当前展开的节点         | string[]                         | -      | -    |
| onExpand     | 展开节点变化的回调函数 | (expandedKeys: string[]) => void | -      | -    |

### TooltipConfig

| 属性               | 说明                | 类型          | 默认值 | 版本 |
| ------------------ | ------------------- | ------------ | ------ | ---- |
| titleConfig        | 标题 Tooltip 配置    | [TooltipProps](https://www.antdv.com/components/tooltip-cn#api) | -      | -    |
| descriptionConfig  | 副标题 Tooltip 配置  | [TooltipProps](https://www.antdv.com/components/tooltip-cn#api) | -      | -    |

## Semantic DOM

<!-- <code src="./demo/_semantic.tsx" simplify="true"></code> -->

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="ThoughtChain"></ComponentTokenTable> -->
## 贡献者

<doc-contributors component-name="thought-chain" :max-count="50" :show-view-all="true" />
