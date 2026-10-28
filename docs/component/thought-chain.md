
# ThoughtChain 思维链

思维链组件用于可视化和追踪 Agent 对 Actions 和 Tools 的调用链。

## 何时使用

* 调试和跟踪复杂 Agent System 中的调用链
* 类似的链式场景中使用

## 代码演示

### 基本

:::demo-v2 基础用法。

thought-chain/basic

:::

### ThoughtChain.Item

:::demo-v2 ThoughtChain.Item 是一个独立的紧凑型组件，支持 `solid`、`outlined`、`text` 三种变体，以及 `loading`、`success`、`error`、`abort` 四种状态。

thought-chain/simple

:::

### 节点状态

:::demo-v2 思维链节点支持配置 `status` 属性来明显的表明当前节点的执行状态。

thought-chain/status

:::

### 可折叠的

:::demo-v2 配置 item 的 `collapsible` 和 `defaultExpandedKeys` 可开启对思维链节点内容区域的折叠功能。

thought-chain/collapsible

:::

### 受控模式

:::demo-v2 通过 `expandedKeys` 和 `onExpand` 实现受控模式。

thought-chain/controlled-collapsible

:::

### 客制化

:::demo-v2 `items` 属性支持灵活的客制化配置，包括自定义图标、脚注、Think 组件嵌套等。支持 `line="dashed"` 虚线样式。

thought-chain/customization

:::

### 嵌套使用

:::demo-v2 ThoughtChain 组件支持嵌套使用。

thought-chain/nested

:::

### 单行折叠

:::demo-v2 通过 `icon: false` 隐藏图标，配合自定义 `styles.itemContent` 实现单行折叠效果。

thought-chain/single-row

:::

## API

### ThoughtChainProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 思维节点集合 | ThoughtChainItemType[] | - | - |
| defaultExpandedKeys | 初始化展开的节点 | string[] | - | - |
| expandedKeys | 当前展开的节点 | string[] | - | - |
| onExpand | 展开节点变化回调 | (expandedKeys: string[]) => void | - | - |
| line | 线条样式 | boolean \| 'solid' \| 'dashed' \| 'dotted' | true | - |
| classNames | 语义化结构的类名 | Record\<SemanticType, string\> | - | - |
| styles | 语义化结构的样式 | Record\<SemanticType, CSSProperties\> | - | - |
| prefixCls | 自定义前缀 | string | - | - |
| rootClassName | 自定义根类名 | string | - | - |

### ThoughtChainItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 思维节点唯一标识符 | string | - | - |
| icon | 思维节点图标，设为 false 可隐藏 | VNode \| string \| number \| false | index+1 | - |
| title | 思维节点标题 | VNode \| string | - | - |
| description | 思维节点描述 | VNode \| string | - | - |
| content | 思维节点内容 | VNode \| string | - | - |
| footer | 思维节点脚注 | VNode \| string | - | - |
| status | 思维节点状态 | 'loading' \| 'success' \| 'error' \| 'abort' | - | - |
| collapsible | 是否可折叠 | boolean | - | - |
| blink | 闪烁动画 | boolean | - | - |

### ThoughtChain.Item Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| variant | 变体 | 'solid' \| 'outlined' \| 'text' | 'solid' | - |
| icon | 图标 | VNode \| string | - | - |
| title | 标题 | VNode \| string | - | - |
| description | 描述 | VNode \| string | - | - |
| status | 状态 | 'loading' \| 'success' \| 'error' \| 'abort' | - | - |
| blink | 闪烁动画 | boolean | - | - |
| onClick | 点击事件 | () => void | - | - |
| classNames | 语义化结构类名 | Record\<'root' \| 'icon' \| 'title' \| 'description', string\> | - | - |
| styles | 语义化结构样式 | Record\<'root' \| 'icon' \| 'title' \| 'description', CSSProperties\> | - | - |

### SemanticType

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| item | 节点项 |
| itemHeader | 节点头部 |
| itemIcon | 节点图标 |
| itemContent | 节点内容 |
| itemFooter | 节点脚注 |

## 主题变量（Design Token）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| itemSolidBg | ThoughtChain.Item solid 背景色 | string | colorFillTertiary |
| itemSolidHoverBg | ThoughtChain.Item solid 悬浮态背景色 | string | colorBgTextHover |
| itemOutlinedBg | ThoughtChain.Item outlined 背景色 | string | colorBgContainer |
| itemOutlinedHoverBg | ThoughtChain.Item outlined 悬浮态背景色 | string | colorBgTextHover |
| itemBorderRadius | ThoughtChain.Item 圆角 | number | borderRadius |
| iconSize | 图标容器尺寸 | number | fontSize |
| colorTextBlinkDefault | 默认打字动画颜色 | string | colorTextDescription |
| colorTextBlink | 打字动画颜色 | string | colorTextBase |
