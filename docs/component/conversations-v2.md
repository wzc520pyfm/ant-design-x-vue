
# Conversations 管理对话 <Badge type="warning" text="v2" />

用于承载用户侧发送的历史对话列表。

## 何时使用

* 需要对多个会话进行管理
* 查看历史会话列表

## 代码演示

### 基本

:::demo-v2 基础用法。

conversations/basic

:::

### 受控模式

:::demo-v2 使用 `activeKey`、`onActiveChange` 属性，控制当前选中的会话。

conversations/controlled-mode

:::

### 分组展示

:::demo-v2 使用 `groupable` 属性开启分组，开启后默认按 Conversation.group 字段分组。

conversations/group

:::

### 分组可折叠

:::demo-v2 配置 `collapsible` 属性为分组开启可折叠功能。

conversations/group-collapsible

:::

### 受控的分组可折叠

:::demo-v2 受控的分组可折叠。

conversations/controlled-collapsible

:::

### 会话操作

<ClientOnly>

:::demo-v2 配合 `menu` 属性，配置操作菜单。

conversations/with-menu

:::

</ClientOnly>

### 自定义操作

:::demo-v2 自定义菜单入口。

conversations/menu-trigger

:::

### 新对话

:::demo-v2 通过 `creation` 属性配置新建对话按钮。

conversations/new-chat

:::

### 自定义新对话

:::demo-v2 自定义新对话按钮的图标、文案和对齐方式。

conversations/custom-new-chat

:::


## API

### ConversationsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeKey | 当前选中的值 | string | - | - |
| defaultActiveKey | 默认选中值 | string | - | - |
| items | 会话列表数据源 | `ItemType`[] | - | - |
| onActiveChange | 选中变更回调 | (value: string) => void | - | - |
| menu | 会话操作菜单 | MenuProps \| ((value: `ConversationItemType`) => MenuProps) | - | - |
| groupable | 是否支持分组, 开启后默认按 `Conversation.group` 字段分组 | boolean \| `GroupableProps` | - | - |
| creation | 新建对话按钮的配置 | `CreationProps` | - | v2 |
| styles | 语义化结构 style | Record<'root' \| 'creation' \| 'group' \| 'item', CSSProperties> | - | - |
| classNames | 语义化结构 className | Record<'root' \| 'creation' \| 'group' \| 'item', string> | - | - |

### ItemType

`ItemType = ConversationItemType | DividerItemType`

### ConversationItemType (Conversation)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标识 | string | - | - |
| label | 会话名称 | VNode \| string | - | - |
| group | 会话分组类型，与 `ConversationsProps.groupable` 联动 | string | - | - |
| icon | 会话图标 | VNode | - | - |
| disabled | 是否禁用 | boolean | - | - |

### DividerItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 固定值 `'divider'` | `'divider'` | - | v2 |
| key | 唯一标识 | string | - | v2 |
| dashed | 是否虚线 | boolean | - | v2 |

### GroupableProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 自定义分组标签渲染 | VNode \| string \| ((group: string, info: { groupInfo }) => VNode) | - | - |
| collapsible | 是否可折叠 | boolean \| ((group: string) => boolean) | - | v2 |
| defaultExpandedKeys | 初始化展开的分组 | string[] | - | v2 |
| expandedKeys | 当前展开的分组（受控） | string[] | - | v2 |
| onExpand | 展开分组变化回调 | (expandedKeys: string[]) => void | - | v2 |

### CreationProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 按钮文案 | VNode \| string \| ((info) => VNode) | `'New Conversation'` | v2 |
| icon | 按钮图标 | VNode \| (() => VNode) | `PlusOutlined` | v2 |
| align | 对齐方式 | `'start'` \| `'center'` \| `'end'` | `'center'` | v2 |
| disabled | 是否禁用 | boolean | false | v2 |
| onClick | 点击回调 | (event?: MouseEvent) => void | - | v2 |

### MenuProps

继承 antdv [MenuProps](https://www.antdv.com/components/menu-cn#api) 属性。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| trigger | 自定义 menu 触发器 | VNode \| ((conversation: ConversationItemType, info: { originNode: VNode }) => VNode) | - | - |
| getPopupContainer | 菜单渲染父节点 | (triggerNode: HTMLElement) => HTMLElement | - | - |

## 主题变量（Design Token）

| Token | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| creationBgColor | 新会话按钮背景颜色 | string | `rgba(primaryColor, 0.15)` |
| creationBorderColor | 新会话按钮边框颜色 | string | `rgba(primaryColor, 0.22)` |
| creationHoverColor | 新会话按钮悬浮态背景颜色 | string | `rgba(primaryColor, 0.25)` |
| shortcutKeyTextColor | 快捷键标识字体颜色 | string | `rgba(primaryColor, 0.65)` |

## 贡献者

<doc-contributors component-name="conversations" :max-count="50" :show-view-all="true" />
