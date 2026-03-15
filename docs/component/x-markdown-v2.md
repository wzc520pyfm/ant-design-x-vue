# XMarkdown 富文本 (v2)

流式友好、可扩展的 Markdown 渲染组件，与 @ant-design/x-markdown 能力对齐。

## 何时使用

- 在对话气泡、消息等场景中渲染 Markdown 内容
- 需要流式输出时配合 `streaming` 与 `useStreaming`
- 需要自定义标题、代码块、Mermaid 等节点时使用 `components` 映射

## 代码演示

### 基本用法

:::demo-v2 通过 `content` 传入 Markdown 字符串即可渲染。

x-markdown/basic

:::

### 自定义组件映射

:::demo-v2 通过 `components` 将 HTML 标签映射为自定义 Vue 组件，可接收 `domNode`、`streamStatus`、`children` 等 props。

x-markdown/components

:::

### 流式渲染

:::demo-v2 使用 `streaming` 标识流式状态，配合 `useStreaming` 处理内容与状态。

x-markdown/streaming

:::

## API

### XMarkdownProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | Markdown 内容 | string | - |
| streaming | 是否流式输出（自定义组件会收到 streamStatus） | boolean | false |
| components | 将标签名映射为自定义 Vue 组件（如 h1、pre、code、mermaid、think） | Record\<string, Component\> | - |
| plugins | 插件列表，在解析前对 content 执行 transform | any[] | - |
| config | marked 解析配置 | MarkedConfig | - |
| className | 根节点类名 | string | - |

### ComponentProps（自定义组件入参）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| domNode | 解析后的 DOM 节点信息（name、attribs、children） | DOMNode |
| streamStatus | 流式状态：`'loading'` \| `'done'` | ComponentStreamStatus |
| children | 子内容（VNode 或文本） | VNode[] \| string |
| 其余 | 标准 HTML 属性及 data-* 等 | Record\<string, any\> |

### useStreaming

用于配合流式内容的组合式函数。

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| content | 内容 ref | Ref\<string\> |
| streaming | 是否流式中 ref（可选） | Ref\<boolean\> |
| onComplete | 流式结束回调 | () => void |

| 返回值 | 说明 | 类型 |
| --- | --- | --- |
| displayedContent | 当前展示内容 | Ref\<string\> |
| status | 状态：idle \| streaming \| complete \| error | Ref\<StreamStatus\> |
| isStreaming | 是否流式中 | Ref\<boolean\> |

### 导出

- `XMarkdown` - 主组件
- `AnimationText` - 打字动画组件
- `useStreaming` - 流式组合式函数
- `parseMarkdown(content, config?)` - 解析 Markdown 为 HTML
- `htmlToVNode(html, options?)` - 将 HTML 转为 VNode（支持 components、streamStatus）
