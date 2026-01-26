# Bubble 对话气泡 (v2)

用于聊天的气泡组件，v2 版本新增了更多功能特性。

::: warning 注意
这是 v2 版本的 Bubble 组件文档，包含了新增的功能特性。如需查看 v1 版本，请访问 [Bubble 对话气泡](/component/bubble)。
:::

## 新功能

v2 版本新增了以下功能：

- **Bubble.System** - 系统消息变体组件
- **Bubble.Divider** - 分隔符变体组件
- **editable** - 可编辑功能
- **streaming** - 流式传输标志
- **extra** - 额外内容插槽
- **footerPlacement** - footer 位置配置
- **contentRender** - 替代 messageRender，支持更多信息
- **onTyping** - 动画执行时回调
- **typing.effect** - 支持 fade-in 和 typing 两种动画效果
- **typing.keepPrefix** - 重新开始动画时保留公共前缀
- **typing.step** - 支持数组格式表示随机区间
- **status / extraInfo** - 消息状态和额外信息

## 代码演示

### 基本

:::demo-v2 基础用法。

bubble/basic

:::

### 加载中

:::demo-v2 通过 `loading` 属性控制加载状态。

bubble/loading

:::

### 变体和形状

:::demo-v2 通过 `variant` 属性设置气泡的样式变体，通过 `shape` 属性设置气泡的形状。

bubble/variant-and-shape

:::

### 头像和位置

:::demo-v2 通过 `avatar` 设置自定义头像，通过 `placement` 设置位置，通过 `extra` 设置额外内容。

bubble/sider-and-placement

:::

### 头部

:::demo-v2 通过 `header` 属性设置气泡的头部。

bubble/header

:::

### 底部和位置

:::demo-v2 通过 `footer` 属性设置气泡的底部，通过 `footerPlacement` 控制底部的位置。

bubble/footer

:::

### 系统消息

:::demo-v2 使用 `Bubble.System` 组件展示系统消息。

bubble/system

:::

### 分隔符

:::demo-v2 使用 `Bubble.Divider` 组件添加分隔符。

bubble/divider

:::

### 动画效果

:::demo-v2 通过 `typing` 属性配置动画效果，支持 `fade-in` 和 `typing` 两种效果。

bubble/animation

:::

### 可编辑

:::demo-v2 通过 `editable` 属性开启可编辑功能。

bubble/editable

:::

### 流式传输

:::demo-v2 通过 `streaming` 属性标识流式传输状态，配合动画效果使用。

bubble/stream

:::

### 自定义渲染内容

:::demo-v2 通过 `contentRender` 自定义渲染内容。

bubble/custom-content

:::

### 渲染 Markdown 内容

:::demo-v2 配合 Markdown 渲染实现富文本内容。

bubble/markdown

:::

### GPT 可视化

:::demo-v2 配合可视化组件实现图表渲染。

bubble/gpt-vis

:::

### 气泡列表

:::demo-v2 预设样式的气泡列表，支持 System 和 Divider 类型。

bubble/list

:::

### 列表扩展功能

:::demo-v2 列表支持 status、extraInfo 等扩展功能。

bubble/list-extra

:::

### 列表滚动控制

:::demo-v2 使用 `scrollTo` 方法控制列表滚动。

bubble/list-scroll

:::

## API

### Bubble

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| avatar | 展示头像 | VNode \| (content, info) => VNode | - | |
| classNames | 语义化结构 class | Record<SemanticDOM, string> | - | |
| content | 聊天内容 | ContentType | - | |
| contentRender | 自定义渲染内容 | (content: ContentType, info: Info) => VNode | - | v2 |
| editable | 是否可编辑 | boolean \| EditableBubbleOption | false | v2 |
| extra | 额外内容 | VNode \| (content, info) => VNode | - | v2 |
| footer | 底部内容 | VNode \| (content, info) => VNode | - | |
| footerPlacement | 底部位置 | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `outer-start` | v2 |
| header | 头部内容 | VNode \| (content, info) => VNode | - | |
| loading | 聊天内容加载状态 | boolean | false | |
| placement | 信息位置 | `start` \| `end` | `start` | |
| shape | 气泡形状 | `default` \| `round` \| `corner` | `default` | v2 新增 default |
| streaming | 是否流式传输 | boolean | false | v2 |
| styles | 语义化结构 style | Record<SemanticDOM, CSSProperties> | - | |
| typing | 打字动画配置 | boolean \| BubbleAnimationOption \| Function | false | v2 增强 |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `filled` | |
| loadingRender | 自定义渲染加载态内容 | () => VNode | - | |
| messageRender | 自定义渲染内容（已废弃，请使用 contentRender） | (content: ContentType) => VNode | - | |
| onTyping | 动画执行时回调 | (rendererContent: string, currentContent: string) => void | - | v2 |
| onTypingComplete | 动画结束回调 | (content?: string) => void | - | |
| onEditConfirm | 编辑确认回调 | (content: string) => void | - | v2 |
| onEditCancel | 编辑取消回调 | () => void | - | v2 |

### BubbleAnimationOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| effect | 动画效果类型 | `typing` \| `fade-in` | `fade-in` |
| step | 内容步进单位，数组格式为随机区间 | number \| [number, number] | 6 |
| interval | 动画触发间隔 | number | 100 |
| keepPrefix | 重新开始动画时是否保留公共前缀 | boolean | true |

### EditableBubbleOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| editing | 是否处于编辑状态 | boolean | false |
| okText | 确认按钮文本 | VNode \| string | 确认 |
| cancelText | 取消按钮文本 | VNode \| string | 取消 |

### Info

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| key | 数据项唯一标识 | string \| number |
| status | 消息状态 | `local` \| `loading` \| `updating` \| `success` \| `error` \| `abort` |
| extraInfo | 额外信息 | AnyObject |

### Bubble.System

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 系统消息内容 | ContentType | - |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `shadow` |
| shape | 气泡形状 | `default` \| `round` \| `corner` | - |
| styles | 语义化结构 style | Record<SemanticDOM, CSSProperties> | - |
| classNames | 语义化结构 class | Record<SemanticDOM, string> | - |

### Bubble.Divider

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 分隔符内容 | ContentType | - |
| dividerProps | 分隔符属性 | DividerProps | - |
| styles | 语义化结构 style | Record<SemanticDOM, CSSProperties> | - |
| classNames | 语义化结构 class | Record<SemanticDOM, string> | - |

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoScroll | 自动滚动到最新位置 | boolean | true |
| items | 气泡数据列表 | BubbleItemType[] | - |
| roles | 气泡默认属性配置 | RoleType | - |
| styles | 语义化结构 style | Record<SemanticDOM, CSSProperties> | - |
| classNames | 语义化结构 class | Record<SemanticDOM, string> | - |
| onScroll | 滚动事件回调 | (e: Event) => void | - |

### BubbleItemType

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| key | 数据项唯一标识（必填） | string \| number |
| role | 角色类型 | `ai` \| `user` \| `system` \| `divider` \| string |
| status | 消息状态 | `local` \| `loading` \| `updating` \| `success` \| `error` \| `abort` |
| extraInfo | 额外信息 | AnyObject |
| ...BubbleProps | 继承 Bubble 的所有属性 | - |

### BubbleListRef

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 原生 DOM 元素 | HTMLDivElement |
| scrollTo | 滚动到指定位置 | (options: ScrollToOptions) => void |

### ScrollToOptions

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| key | 滚动到指定 key 的气泡 | string \| number |
| top | 滚动位置 | number \| `bottom` \| `top` |
| offset | 滚动偏移量 | number |
| behavior | 滚动行为 | `smooth` \| `instant` \| `auto` |
| block | 滚动对齐方式 | `start` \| `center` \| `end` \| `nearest` |

## Bubble Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| avatar | 头像 | - |
| header | 头部面板 | { content: ContentType, info: Info } |
| footer | 底部内容 | { content: ContentType, info: Info } |
| extra | 额外内容 | { content: ContentType, info: Info } |
| loading | loading 占位 | - |
| content | 消息内容 | { content: ContentType } |

## Bubble.List Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| avatar | 头像 | { item: BubbleItemType } |
| header | 头部面板 | { item: BubbleItemType } |
| footer | 底部内容 | { item: BubbleItemType } |
| extra | 额外内容 | { item: BubbleItemType } |
| loading | loading 占位 | { item: BubbleItemType } |
| content | 消息内容 | { item: BubbleItemType } |

## Semantic DOM

- root: 根元素
- content: 内容区域
- body: 主体区域
- header: 头部区域
- footer: 底部区域
- avatar: 头像区域
- extra: 额外内容区域

## 贡献者

<doc-contributors component-name="bubble" :max-count="50" :show-view-all="true" />
