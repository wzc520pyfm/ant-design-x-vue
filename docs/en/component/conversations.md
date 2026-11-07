# Conversations

Used to host the list of historical dialogues sent by the user.

## When to use

- Need to manage multiple conversations
- View the historical conversation list

## Examples

### Basic

:::demo-v2 Basic usage.

conversations/basic

:::

### Controlled mode

:::demo-v2 Use `activeKey` and `onActiveChange` properties to control the currently selected conversation.

conversations/controlled-mode

:::

### Grouped display

:::demo-v2 Use the `groupable` property to enable grouping. Once enabled, it defaults to grouping by the Conversation.group field.

conversations/group

:::

### Collapsible groups

:::demo-v2 Configure the `collapsible` property to enable collapsibility for groups.

conversations/group-collapsible

:::

### Controlled collapsible groups

:::demo-v2 Controlled collapsible groups.

conversations/controlled-collapsible

:::

### Conversation actions

<ClientOnly>

:::demo-v2 With the `menu` property, configure the operation menu.

conversations/with-menu

:::

</ClientOnly>

### Custom actions

:::demo-v2 Custom menu trigger.

conversations/menu-trigger

:::

### New conversation

:::demo-v2 Use the `creation` property to configure the new conversation button.

conversations/new-chat

:::

### Custom new conversation

:::demo-v2 Customize the new-conversation icon, label, and alignment.

conversations/custom-new-chat

:::

### Keyboard shortcuts

:::demo-v2 Use `shortcutKeys` to switch conversations or trigger the creation of a new conversation. You can also configure global shortcuts in `XProvider` under `conversations.shortcutKeys`.

conversations/shortcut-keys

:::

### Infinite scroll

<ClientOnly>

:::demo-v2 Load more conversations with infinite scroll.

conversations/infinite-load

:::

</ClientOnly>


Mobile behavior: `useMobile` is used internally to detect devices. The mobile conversation action menu icon will always be displayed (plus `ant-conversations-menu-icon-mobile`) and no longer relies on hover.

## API

### ConversationsProps

| Properties | Description | Type | Default Value | Version |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------ | ---- |
| activeKey | currently selected value | string | - | - |
| defaultActiveKey | Default selected value | string | - | - |
| items | Session list data source | `ItemType`[] | - | - |
| onActiveChange | Selected change callback | (value: string, item?: ItemType) => void | - | - |
| menu | Conversation operation menu | MenuProps \| ((value: `ConversationItemType`) => MenuProps) | - | - |
| groupable | Whether to support grouping, after enabled, the default grouping is based on the `Conversation.group` field | boolean \| `GroupableProps` | - | - |
| creation | Configuration of new dialog button | `CreationProps` | - | v2 |
| shortcutKeys | Shortcut keys. `creation` triggers new creation, `items` selects sessions in order. Modifier keys are `'Ctrl' \| 'Alt' \| 'Meta' \| 'Shift'` and the last key is `KeyboardEvent.keyCode` or `'number'` (numeric keys 1–9) | \{ creation?: ShortcutKeys; items?: ShortcutKeys \| ShortcutKeys[] \} | - | v2 |
| styles           | Semantic styles                                                                                                                                                       | Record<'root' \| 'creation' \| 'group' \| 'item', CSSProperties\>      | -      | -    |
| classNames       | Semantic class namesName                                                                                                                                                   | Record<'root' \| 'creation' \| 'group' \| 'item', string\>             | -      | -    |
| rootClassName    | Root class name                                                                                                                                                             | string                                                                | -      | -    |

### ItemType

`ItemType = ConversationItemType | DividerItemType`

### ConversationItemType (Conversation)

| Properties | Description | Type | Default Value | Version |
| -------- | ---------------------------------------------------- | --------------- | ------ | ---- |
| key | unique identifier | string | - | - |
| label | session name | VNode \| string | - | - |
| group | Conversation grouping type, linked with `ConversationsProps.groupable` | string | - | - |
| icon | session icon | VNode | - | - |
| disabled | Whether disabled                                             | boolean         | -      | -    |

### DividerItemType

| Properties | Description | Type | Default Value | Version |
| ------ | ------------------ | ----------- | ------ | ---- |
| type | Fixed value `'divider'` | `'divider'` | - | v2 |
| key | unique identifier | string | - | v2 |
| dashed | Whether to dash | boolean | - | v2 |

### GroupableProps

| Properties | Description | Type | Default Value | Version |
| ------------------- | ---------------------- | ------------------------------------------------------------------ | ------ | ---- |
| label | Custom group label rendering | VNode \| string \| ((group: string, info: { groupInfo }) => VNode) | - | - |
| collapsible | Whether it is foldable | boolean \| ((group: string) => boolean) | - | v2 |
| defaultExpandedKeys | Initialize expanded groups | string[] | - | v2 |
| expandedKeys | Currently expanded group (controlled) | string[] | - | v2 |
| onExpand | Expanded group change callback | (expandedKeys: string[]) => void | - | v2 |

### CreationProps

| Properties | Description | Type | Default Value | Version |
| -------- | ---------------------------------------------------------------------- | ------------------------------------ | ----------------------- | ---- |
| label | button copy. Function parameters include `shortcutKeyInfo` and `components.CreationLabel` | VNode \| string \| ((info) => VNode) | Language pack, English `New chat` | v2 |
| icon | button icon | VNode \| (() => VNode) | `PlusOutlined` | v2 |
| align | alignment | `'start'` \| `'center'` \| `'end'` | `'center'` | v2 |
| disabled | Whether disabled                                                               | boolean                              | false                   | v2   |
| onClick | Click callback | (event?: MouseEvent) => void | - | v2 |

### MenuProps

Inherit antdv [MenuProps](https://www.antdv.com/components/menu-cn#api) properties.

| Properties | Description | Type | Default Value | Version |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------- | ------ | ---- |
| trigger | Custom menu trigger | VNode \| ((conversation: ConversationItemType, info: { originNode: VNode }) => VNode) | - | - |
| getPopupContainer | Menu rendering parent node | (triggerNode: HTMLElement) => HTMLElement | - | - |

## Semantic DOM

<vp-semantic component="Conversations"></vp-semantic>

## Design Token

| Token | Description | Type | Default value |
| -------------------- | ------------------------ | ------ | -------------------------- |
| creationBgColor | New session button background color | string | `rgba(primaryColor, 0.15)` |
| creationBorderColor  | New session button border color       | string | `rgba(primaryColor, 0.22)` |
| creationHoverColor   | New session button hover background color | string | `rgba(primaryColor, 0.25)` |
| shortcutKeyTextColor | Shortcut key label font color       | string | `rgba(primaryColor, 0.65)` |

## Contributors

<doc-contributors component-name="conversations" :max-count="50" :show-view-all="true" />
