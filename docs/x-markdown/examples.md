# 代码示例

用于渲染 LLM 返回的流式 Markdown。下面按 `@ant-design/x-markdown@2.0.0` 的「代码示例」排列。每一则都是 Vue 已经实现的能力。

可编辑的预览在 [在线体验](/x-markdown/playground)，和基础用法是同一块输入框。

## 基础用法

:::demo-v2 markdown 基础语法渲染。文本框里改内容会立刻重绘。

x-markdown/basic

:::

## 流式处理

:::demo-v2 未完成内容逐段送入，结束后关闭 streaming。

x-markdown/streaming

:::

## 插件使用

:::demo-v2 `plugins` 的 `transform` 在 marked 之前改写字符串。公式、高亮、Mermaid 见对应插件页。

x-markdown/plugins

:::

## 自定义组件

:::demo-v2 `components` 把标签映射成自己的 Vue 组件。

x-markdown/components

:::

## 公式

:::demo-v2 `Latex` 插件。

x-markdown/latex

:::

## 代码高亮

:::demo-v2 `HighlightCode`。

x-markdown/highlight

:::

## Mermaid

:::demo-v2 围栏语言是 mermaid 时交给 `Mermaid`。

x-markdown/mermaid

:::

## 主题

:::demo-v2 light / dark 类名。

x-markdown/themes

:::

## 自定义标记 tokenizer

:::demo-v2 用 marked `extensions` 把 `%` 标题解析成 heading。

x-markdown/tokenizer

:::

## 标记处理 walkTokens

:::demo-v2 用 `config.walkTokens` 改写或拦截 token。

x-markdown/walk-tokens

:::

## 渲染前处理 renderer

:::demo-v2 自定义 marked `renderer`，再配合 `components` 替换标签。

x-markdown/renderer

:::

## 中文链接处理

:::demo-v2 裸 URL 后紧跟中文或括号时，截断链接并保留后缀文本。

x-markdown/chinese-link

:::

## XSS 防御

:::demo-v2 DOMPurify 会去掉危险脚本、事件属性和 javascript: 链接。

x-markdown/xss

:::

## 流式语法

:::demo-v2 未闭合的链接、表格等先占位，不按半截 Markdown 解析。

x-markdown/streaming-syntax

:::

## 流式动画

:::demo-v2 `streaming.enableAnimation` 让新出现的段落淡入。

x-markdown/animation

:::

## 新标签页打开链接

:::demo-v2 `openLinksInNewTab` 给链接加上 `target="_blank"`。

x-markdown/open-links

:::

## 思考过程

:::demo-v2 自定义标签交给 `Think`。

x-markdown/think

:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 要渲染的 Markdown 内容 | `string` | - |
| children | Markdown 内容，`content` 的别名 | `string` | - |
| components | 用自定义 Vue 组件替换 HTML / 自定义标签，详见 [组件总览](/x-markdown/components) | `Record<string, Component>` | - |
| paragraphTag | 段落使用的 HTML 标签。自定义组件含块级元素时可改成 `div`，避免非法嵌套 | `string` | `'p'` |
| streaming | 流式渲染配置，见 [流式语法](/x-markdown/streaming) | `boolean \| StreamingOption` | - |
| config | marked 解析与扩展配置 | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| plugins | 兼容旧写法：带 `transform(content)` 的对象会在解析前改写字符串；优先用 `config` + marked extensions | `any[]` | - |
| openLinksInNewTab | 是否给所有 `a` 标签加上 `target="_blank"`（以及 `rel="noopener noreferrer"`） | `boolean` | `false` |
| dompurifyConfig | DOMPurify 配置，用于 HTML 消毒与 XSS 防护 | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| className | 根节点额外 CSS 类名 | `string` | - |
| rootClassName | `className` 的别名 | `string` | - |
| style | 根节点内联样式 | `CSSProperties` | - |
| prefixCls | CSS 类名前缀覆盖 | `string` | - |

### StreamingOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 后面是否还有 chunk。为 `false` 时刷新缓存并完成渲染 | `boolean` | `false` |
| enableAnimation | 为块级元素（`p`、`li`、`h1`–`h4`）启用文字淡入 | `boolean` | `false` |
| animationConfig | 文字出现动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| incompleteMarkdownComponentMap | 未完成语法对应的自定义组件名。流式输出遇到未闭合的链接、表格、HTML 等时，可用占位 / loading 组件包裹片段 | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |

#### AnimationConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fadeDuration | 淡入动画时长（毫秒） | `number` | `200` |
| easing | 缓动函数 | `string` | `'ease-in-out'` |

### ComponentProps

自定义 `components` 映射组件收到的入参：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | 解析后的 DOM 节点信息（标签名、属性、子节点结构） | `DOMNode` | - |
| streamStatus | 流式状态：`loading` 表示该块仍在输出，`done` 表示已闭合。目前主要覆盖 HTML 与围栏代码；缩进代码块没有明确结束符，始终为 `done`。`code` 也可读 `data-state` | `'loading' \| 'done'` | - |
| block | 仅 `code`：`data-block="true"` 时为块级代码 | `boolean` | - |
| children | 组件包裹的内容 | `VNode[] \| string` | - |
| 其余 | 标准 HTML 属性（`href`、`title`、`class` / `className` 等）与自定义 `data-*` | `Record<string, any>` | - |

### StreamCacheTokenType

与源码 `StreamCacheTokenType` 枚举一致（注意是 `html`，不是文档旧稿里的 `heading` / `xml`）：

```ts
type StreamCacheTokenType =
  | 'text' // 纯文本
  | 'link' // 链接 [text](url)
  | 'image' // 图片 ![alt](src)
  | 'html' // HTML / 自定义标签 <tag>
  | 'emphasis' // 强调 *斜体* **粗体**
  | 'list' // 列表 - + *
  | 'table'; // 表格 | header | content |
```

`hasNextChunk` 为 `true` 时，未完成 token 会转成 `incomplete-<token>`（可用 `incompleteMarkdownComponentMap` 改名），原文放在 `data-raw`（`encodeURIComponent`）。`text` 不生成占位标签。

## FAQ

### Components 与 config marked extensions 的区别

#### config marked extensions（解析扩展）

`config` 里的 [`extensions`](https://marked.js.org/using_pro#extensions) 在 **Markdown → HTML** 阶段生效：

- **阶段**：Markdown 解析
- **作用**：识别并转换特殊语法
- **例子**：把 `[^1]` 脚注语法变成 `<footnote>1</footnote>`
- **场景**：扩展 Markdown 语法

```ts
const footnoteExtension = {
  name: 'footnote',
  level: 'inline',
  start(src) {
    return src.match(/\[\^/)?.index;
  },
  tokenizer(src) {
    const rule = /^\[\^([^\]]+)\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'footnote',
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token) {
    return `<footnote>${token.text}</footnote>`;
  },
};

// <XMarkdown content="脚注示例[^1]" :config="{ extensions: [footnoteExtension] }" />
```

#### components（组件替换）

`components` 在 **HTML → VNode** 阶段把标签换成 Vue 组件：

- **阶段**：渲染
- **作用**：替换 HTML / 自定义标签
- **例子**：把 `<footnote>1</footnote>` 换成可点击的脚注组件
- **场景**：自定义样式与交互

完整示例见 [自定义插件](/x-markdown/custom-plugin)。
