# Mermaid 图表

> English: [Mermaid](/component/mermaid.en)

用于渲染 Mermaid 图表。对齐 React `@ant-design/x` Mermaid（2.10）。

> 独立组件。Markdown 插件 [`Mermaid`](/x-markdown/data-display) 仍保留，二者用途不同（插件 ≠ 本组件）。

## 何时使用

- 在应用中渲染支持缩放、平移、图像/代码双视图切换的交互式 Mermaid 图表。
- 与 XMarkdown 结合，通过 `components.code` 渲染 `mermaid` 围栏代码块。

## 代码演示

### 基本

:::demo-v2 基础用法。

mermaid/basic

:::

### 自定义 Header

:::demo-v2 通过 `header` 自定义头部；传 `null` / `false` 可隐藏。

mermaid/custom-header

:::

### Header Actions

:::demo-v2 通过 `actions` 控制缩放 / 下载 / 复制与自定义操作。

mermaid/header-actions

:::

### 配合 XMarkdown

:::demo-v2 在 Bubble + XMarkdown 中作为 `components.code` 渲染 mermaid 围栏。

mermaid/with-xmarkdown

:::

## API

### MermaidProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | Mermaid 代码内容（也可用默认插槽） | `string` | - | - |
| header | 头部内容；`null` / `false` 时不显示默认头 | `VNode \| string \| (() => …) \| false \| null` | - | - |
| classNames | 语义化 className | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', string>>` | - | - |
| styles | 语义化 style | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', CSSProperties>>` | - | - |
| highlightProps | 代码高亮配置（当前代码视图为 `pre`；接入 CodeHighlighter 后生效） | `Record<string, unknown>` | - | - |
| config | `mermaid.initialize` 配置（请保持引用稳定） | `MermaidConfig` | - | - |
| actions | 操作栏配置 | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean; customActions?: ItemType[] }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` | - |
| onRenderTypeChange | 视图切换回调 | `(value: 'image' \| 'code') => void` | - | - |
| prefixCls | 样式类名前缀 | `string` | - | - |
| rootClassName | 根节点额外 class | `string` | - | - |
| style | 根节点样式 | `CSSProperties` | - | - |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | Mermaid 代码内容 |
| header | 自定义头部 |

### Mermaid Ref

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 获取原生 DOM 节点 | `HTMLElement` |

### SemanticType

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| header | 头部容器 |
| graph | 图表容器 |
| code | 代码容器 |

## Semantic DOM

<vp-semantic component="Mermaid"></vp-semantic>

## 主题变量（Design Token）

| Token | 说明 | 默认 |
| --- | --- | --- |
| colorBgTitle | 标题背景颜色 | `colorFillContent` |
| colorTextTitle | 标题文本颜色 | `colorText` |
| colorBorderCode | 代码块边框颜色 | `colorBorderSecondary` |
| colorBorderGraph | 图表边框颜色 | `colorBorderSecondary` |

## FAQ

### 使用 `config` 时，如何避免重复渲染或重复初始化？

当传递 `config` prop 时，请确保其为引用稳定的对象。避免在模板中直接传入对象字面量（如 `:config="{ theme: 'base' }"`），否则每次父组件重渲染都会触发 Mermaid 重新初始化。

推荐做法：

```ts
import { computed } from 'vue';

// 动态配置：使用 computed 缓存
const config = computed(() => ({
  theme: isDark.value ? 'dark' : 'base',
  fontFamily: 'monospace',
}));

// 静态配置：提取为常量
const CONFIG = { theme: 'base', fontFamily: 'monospace' } as const;
```

## 贡献者

<doc-contributors component-name="mermaid" :max-count="50" :show-view-all="true" />
