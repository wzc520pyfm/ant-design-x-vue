
# Welcome 欢迎

清晰传达给用户可实现的意图范围和预期功能。

## 何时使用

使用合适的欢迎推荐组件，可以有效降低用户学习成本，让用户快速了解并顺利开始。

## 代码演示

### 基本

:::demo 基础用法。

welcome/basic

:::

### 变体

:::demo 通过 `variant` 属性设置样式变体。

welcome/variant

:::

### 背景定制

:::demo 自定义部分样式。

welcome/background

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### WelcomeProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个提示项的不同部分。 | Record<'icon' \| 'title' \| 'description' \| 'extra', string> | - | - |
| description | 显示在提示列表中的描述。 | VNode \| string \| (() => VNode \| string) | - | - |
| extra | 显示在提示列表末尾的额外操作。 | VNode \| string \| (() => VNode \| string) | - | - |
| icon | 显示在提示列表前侧的图标。 | VNode \| () => VNode | - | - |
| rootClassName | 根节点的样式类名。 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分。 | Record<'icon' \| 'title' \| 'description' \| 'extra', CSSProperties> | - | - |
| title | 显示在提示列表顶部的标题。 | VNode \| string \| (() => VNode \| string) | - | - |
| variant | 变体类型。 | 'filled' \| 'borderless' | 'filled' | - |

### Welcome Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 显示在提示列表顶部的标题 |
| description | 显示在提示列表中的描述 |
| icon | 显示在提示列表前侧的图标 |
| extra | 显示在提示列表末尾的额外操作 |


## Semantic DOM

<vp-semantic component="Welcome"></vp-semantic>

## 主题变量（Design Token）

## 贡献者

<doc-contributors component-name="welcome" :max-count="50" :show-view-all="true" />
