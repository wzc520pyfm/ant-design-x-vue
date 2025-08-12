
# Conversations 管理对话

用于承载用户侧发送的历史对话列表。

## 何时使用

* 需要对多个会话进行管理
* 查看历史会话列表

## 代码演示

### 基本

:::demo 基础用法。

conversations/basic

:::

### 会话操作

<ClientOnly>

:::demo 配合 `menu` 属性，配置操作菜单

conversations/with-menu

:::

</ClientOnly>

### 自定义操作

:::demo 自定义菜单入口

conversations/menu-trigger

:::

### 可编辑

:::demo 可编辑对话名

conversations/editable

:::

### 受控模式

:::demo 使用 `activeKey`、`onChange` 属性，控制当前选中的会话

conversations/controlled-mode

:::

### 分组展示

:::demo 使用 `groupable` 属性开启分组，开启后默认按 [Conversation.group](#) 字段分组

conversations/group

:::

### 分组排序

:::demo 通过 `groupable.sort` 属性对分组排序, 通过 `groupable.title` 自定义渲染分组

conversations/group-sort

:::


## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### ConversationsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeKey | 当前选中的值 | string | - | - |
| defaultActiveKey | 默认选中值 | string | - | - |
| items | 会话列表数据源 | `Conversation`[] | - | - |
| onActiveChange | 选中变更回调 | (value: string) => void | - | - |
| menu | 会话操作菜单 | MenuProps \| ((value: `Conversation`) => MenuProps) | - | - |
| groupable | 是否支持分组, 开启后默认按 `Conversation.group` 字段分组 | boolean \| GroupableProps | - | - |
| styles | 语义化结构 style | Record<'item', CSSProperties> | - | - |
| classNames | 语义化结构 className | Record<'item', string> | - | - |

### Conversation

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标识 | string | - | - |
| label | 会话名称 | VNode \| string | - | - |
| timestamp | 会话时间戳 | number | - | - |
| group | 会话分组类型，与 `ConversationsProps.groupable` 联动 | string | - | - |
| icon | 会话图标 | VNode \| string | - | - |
| disabled | 是否禁用 | boolean | - | - |

### GroupableProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| `sort` | 分组排序函数 | (a: string, b: string) => number | - | - |
| `title` | 自定义渲染组件 | ((group: string, info: { components: { GroupTitle: typeof GroupTitle } }) => VNode) | - | - |

### MenuProps

继承 antdv [MenuProps](https://www.antdv.com/components/menu-cn#api) 属性。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| `trigger` | 自定义menu触发器 | VNode \| ((conversation: Conversation, info: \{ originNode: VNode \}) => VNode) | - | - |

## 主题变量（Design Token）
## 贡献者

<doc-contributors component-name="conversations" :max-count="50" :show-view-all="true" />
