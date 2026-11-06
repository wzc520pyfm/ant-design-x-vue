
# Actions 操作列表

用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 何时使用

Actions 组件用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 代码演示

### 基本

<ClientOnly>

:::demo-v2 基础用法。

actions/basic

:::

</ClientOnly>

### 更多菜单项

<ClientOnly>

:::demo-v2 支持嵌套菜单项和自定义点击事件。

actions/sub

:::

</ClientOnly>

### 预设模板

<ClientOnly>

:::demo-v2 使用 `Actions.Feedback`、`Actions.Copy`、`Actions.Audio`、`Actions.Item` 等预设能力。

actions/preset

:::

</ClientOnly>

### 使用变体

<ClientOnly>

:::demo-v2 使用 `variant` 属性设置不同的样式变体。

actions/variant

:::

</ClientOnly>

### 渐入效果

<ClientOnly>

:::demo-v2 通过 `fadeIn` / `fadeInLeft` 开启渲染渐入。

actions/fadeIn

:::

</ClientOnly>


移动端行为：内部使用 `useMobile` 做 SSR 安全的设备检测。在移动设备上，操作项和 `Actions.Feedback` 不再渲染 Tooltip（避免点击穿透），带子菜单的项默认以 `click` 触发（仍可通过 `triggerSubMenuAction` 覆盖）。

`useMobile` 也可直接从 `ant-design-x-vue` 引入：

```ts | pure
import { useMobile } from 'ant-design-x-vue';

const isMobile = useMobile(); // Ref<boolean>，服务端与首屏为 false，挂载后更新
```

## API

通用属性参考：[通用属性](/development/common-props)。

### ActionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | [ItemType](#itemtype)[] | - | - |
| onClick | 组件被点击时的回调函数 | `function({ item, key, keyPath, domEvent })` | - | - |
| dropdownProps | 下拉菜单的配置属性 | DropdownProps | - | - |
| variant | 变体 | `borderless` \| `outlined` \| `filled` | `borderless` | - |
| fadeIn | 是否开启渲染渐入 | boolean | - | - |
| fadeInLeft | 是否开启从左到右渐入 | boolean | - | - |
| rootClassName | 根节点样式类 | string | - | - |
| className | 外层 className | string | - | - |
| style | 根节点样式 | CSSProperties | - | - |
| classNames | 语义化结构 class | Record\<SemanticType, string\> | - | - |
| styles | 语义化结构 style | Record\<SemanticType, CSSProperties\> | - | - |
| prefixCls | 样式类名前缀 | string | - | - |

`block` 已废弃，请使用 `variant`。

### ItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | VNodeChild | - | - |
| onItemClick | 点击自定义操作按钮时的回调 | (info?: [ItemType](#itemtype)) => void | - | - |
| danger | 语法糖，设置危险样式 | boolean | false | - |
| subItems | 子操作项 | Omit\<ItemType, 'subItems' \| 'triggerSubMenuAction' \| 'actionRender'\>[] | - | - |
| triggerSubMenuAction | 触发子菜单的操作。未指定时桌面端为 `hover`，移动端为 `click` | `hover` \| `click` | 桌面 `hover` / 移动 `click` | - |
| actionRender | 自定义渲染操作项内容 | ((item: [ItemType](#itemtype)) => VNodeChild) \| VNodeChild | - | - |

### Actions.Feedback

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 反馈状态值 | `like` \| `dislike` \| `default` | `default` | - |
| onChange | 反馈状态变化回调 | (value: `like` \| `dislike` \| `default`) => void | - | - |

### Actions.Copy

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| text | 需要复制的文本 | string | `''` | - |
| icon | 复制按钮图标 | VNodeChild | - | - |

### Actions.Audio

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| status | 播放状态 | `loading` \| `error` \| `running` \| `default` | `default` | - |

### Actions.Item

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| status | 状态 | `loading` \| `error` \| `running` \| `default` | `default` | - |
| label | 自定义操作的显示标签 | string | - | - |
| defaultIcon | 默认状态图标 | VNodeChild | - | - |
| runningIcon | 运行状态图标 | VNodeChild | - | - |

## Semantic DOM

<vp-semantic component="Actions"></vp-semantic>

> `Actions.Feedback` 另支持语义化结构：`root` / `like` / `liked` / `dislike` / `disliked`。`Actions.Copy` / `Actions.Audio` / `Actions.Item` 当前仅暴露根级样式属性，无额外 semantic slots。

## 主题变量（Design Token）

组件暂无自定义 Component Token，可通过全局 Design Token 定制。

## 贡献者

<doc-contributors component-name="actions" :max-count="50" :show-view-all="true" />
