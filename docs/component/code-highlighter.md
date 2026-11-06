# CodeHighlighter 代码高亮

> English: [CodeHighlighter](/component/code-highlighter.en)

用于高亮代码格式。对齐 React `@ant-design/x` CodeHighlighter。

> 独立组件。Markdown 插件 [`HighlightCode`](/x-markdown/plugins) 仍保留，二者用途不同（插件 ≠ 本组件）。

## 何时使用

- 展示带语法高亮的代码片段，并提供复制功能及头部语言信息。
- 与 XMarkdown 结合，通过 `components.code` 渲染围栏代码块。

## 代码演示

### 基本

:::demo-v2 基础用法，支持按需语言加载（`prismLightMode`）。

code-highlighter/basic

:::

### 自定义 Header

:::demo-v2 通过 `header` 自定义头部；传 `false` / `null` 可隐藏。

code-highlighter/custom-header

:::

### 配合 XMarkdown

:::demo-v2 在 Bubble + XMarkdown 中作为 `components.code` 使用。

code-highlighter/with-xmarkdown

:::

## API

### CodeHighlighterProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| lang | 代码语言类型 | `string` | - | - |
| children | 代码内容（也可用默认插槽） | `string` | - | - |
| header | 头部内容；`false` / `null` 时不显示 | `VNode \| string \| (() => VNode \| string \| false \| null) \| false \| null` | - | - |
| highlightProps | 透传给高亮引擎的额外配置（当前支持 `showLineNumbers` / `startingLineNumber` / `codeTagProps` 等） | `CodeHighlighterHighlightProps` | - | - |
| prismLightMode | 是否 Prism 轻量模式（按 `lang` 按需加载） | `boolean` | `true` | - |
| classNames | 语义化 className | `Partial<Record<SemanticType, string>>` | - | - |
| styles | 语义化 style | `Partial<Record<SemanticType, CSSProperties>>` | - | - |
| prefixCls | 样式类名前缀 | `string` | - | - |
| rootClassName | 根节点额外 class | `string` | - | - |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 代码内容（字符串文本） |
| header | 自定义头部 |

### CodeHighlighter Ref

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 获取原生 DOM 节点 | `HTMLElement` |

### SemanticType

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| header | 头部容器 |
| headerTitle | 标题 |
| code | 代码容器 |

## Semantic DOM

<vp-semantic component="CodeHighlighter"></vp-semantic>

## 主题变量（Design Token）

| Token | 说明 | 默认 |
| --- | --- | --- |
| colorBgTitle | 标题背景颜色 | `colorFillContent` |
| colorTextTitle | 标题文本颜色 | `colorText` |
| colorBorderCode | 代码块边框颜色 | `colorBorderSecondary` |

## 贡献者

<doc-contributors component-name="code-highlighter" :max-count="50" :show-view-all="true" />
