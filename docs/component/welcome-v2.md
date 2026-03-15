
# Welcome 欢迎

清晰传达给用户可实现的意图范围和预期功能。

## 何时使用

使用合适的欢迎推荐组件，可以有效降低用户学习成本，让用户快速了解并顺利开始。

## 代码演示

### 基本

:::demo-v2 基础用法。

welcome/basic

:::

### 变体

:::demo-v2 通过 `variant` 属性设置样式变体。

welcome/variant

:::

### 背景定制

:::demo-v2 自定义部分样式。

welcome/background

:::

## API

### WelcomeProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个部分。 | Record\<SemanticType, string\> | - | - |
| description | 描述内容。 | VNode \| string \| (() => VNode \| string) | - | - |
| extra | 额外操作内容。 | VNode \| string \| (() => VNode \| string) | - | - |
| icon | 图标，支持传入 URL 字符串自动渲染为图片。 | VNode \| string \| (() => VNode \| string) | - | - |
| rootClassName | 根节点的样式类名。 | string | - | - |
| styles | 自定义样式，用于各个部分。 | Record\<SemanticType, CSSProperties\> | - | - |
| title | 标题内容。 | VNode \| string \| (() => VNode \| string) | - | - |
| variant | 变体类型。 | 'filled' \| 'borderless' | 'filled' | - |

### Welcome Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 标题内容 |
| description | 描述内容 |
| icon | 图标内容 |
| extra | 额外操作内容 |

### SemanticType

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| title | 标题 |
| description | 描述 |
| icon | 图标 |
| extra | 额外内容 |

## 主题变量（Design Token）

## 贡献者

<doc-contributors component-name="welcome" :max-count="50" :show-view-all="true" />
