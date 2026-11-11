# XMarkdown 流式语法

流式语法处理 LLM 流式返回的 Markdown：语法补全与缓存、增量切段、打字机、淡入动画以及尾标。对齐 React `@ant-design/x-markdown@2.10`。

## 代码演示

:::demo-v2 左边不做流式处理，右边 `streaming={isStreaming}`。布尔预设会打开 `incremental`、`incompleteMarkdown: 'complete'`、`typewriter`（不含 tail）。

x-markdown/streaming-preset

:::

:::demo-v2 上方切换 Mixed / Link / Image / Html / Table / Emphasis / InlineCode，左边是正在打出的源码，右边是渲染结果。没写完的链接显示 16px 占位图标，而不是原始 `[text](url`。Re-Render / Run Stream 会重头打字并打开淡入。

x-markdown/streaming-syntax

:::

:::demo-v2 也可以只用布尔 `streaming`，配合逐字输出看淡入效果。

x-markdown/animation

:::

## API

### streaming

`streaming` 接受布尔值或对象。传布尔值即预设：`true` 表示流式进行中，等同 `hasNextChunk: true` 并打开 `incremental`、`incompleteMarkdown: 'complete'`、`typewriter`；`false` 表示流已结束，按最终内容渲染。把应用里现成的 `isStreaming` 直接传进来即可：`<XMarkdown :content="content" :streaming="isStreaming" />`。传对象则逐项控制。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| **hasNextChunk** | 后面是否还有数据。为 `false` 时刷新缓存并完成渲染 | `boolean` | `false` |
| **incremental** | 按标题切段，每个 chunk 只重新解析、渲染正在增长的最后一段。传对象可设置 `minSectionChars`（短于该长度的段并入下一段）和 `keepSectionsOnEnd`（默认 `true`：流结束后各段保持不变；`false`：流结束时回到整篇一次性渲染） | `boolean \| { minSectionChars?: number; keepSectionsOnEnd?: boolean }` | `false` |
| **incompleteMarkdown** | 未写完的语法如何显示：`placeholder` 扣住或显示占位组件；`complete` 把写到一半的强调、行内代码、链接文字、列表项当作完整文本立刻显示 | `'placeholder' \| 'complete'` | `'placeholder'` |
| **incompleteMarkdownComponentMap** | 未完成语法的组件映射；对某个语法显式配置后以占位组件为准 | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |
| **typewriter** | 打字机效果：新到的内容按 chunk 节奏匀速放出，而不是整块出现 | `boolean \| TypewriterConfig` | `false` |
| **enableAnimation** | 启用文字淡入动画 | `boolean` | `false` |
| **animationConfig** | 文字动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| **tail** | 是否启用尾部指示器；`true` 使用默认 `▋`，传对象可自定义 | `boolean \| TailConfig` | `false` |

> `incremental` 只在顶格的 ATX 标题前切分；围栏代码、HTML 块、`$$` 公式里的 `#` 行不算标题。文档里出现链接引用定义或脚注定义、或自定义组件标签跨越切点时不切分。

### TypewriterConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| unit | 放出单位。`char` 逐字；`sentence` 攒到分隔符一起放出 | `'char' \| 'sentence'` | `'char'` |
| delimiters | 句子分隔符 | `string[]` | `['。', '！', '？', '.', '!', '?', '\n']` |
| minCps | 最低速度（字/秒） | `number` | `24` |
| maxCps | 最高速度（字/秒） | `number` | `3000` |
| pauseMs | `unit` 为 `char` 时放出分隔符后的停顿（毫秒） | `number` | `0` |
| maxSentenceChars | `unit` 为 `sentence` 时最长攒字数，超过后退回逐字放出 | `number` | `120` |

### TailConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 尾部显示的内容 | `string` | `'▋'` |
| component | 自定义尾部组件，优先级高于 content | `Component` | - |

### AnimationConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fadeDuration | 淡入时长（毫秒） | `number` | `200` |
| easing | 缓动函数 | `string` | `'ease-in-out'` |
| splitBy | 淡入单位。`chunk` 每次新到的文本单独淡入；`sentence` 并入当前句子 | `'chunk' \| 'sentence'` | `'chunk'` |
| delimiters | `splitBy` 为 `sentence` 时的分隔符 | `string[]` | `['。', '！', '？', '.', '!', '?', '\n']` |
| maxSentenceChars | `splitBy` 为 `sentence` 时一个淡入单元最多字符数 | `number` | `120` |

### debug

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| debug | 是否启用 FPS / 内存性能监控浮层，支持录制并查看性能图表 | `boolean` | `false` |

> `debug` 仅用于开发环境。生产环境请关闭，避免额外开销和信息暴露。

### 自定义组件缓存

`arePropsEqualIgnoringDomNode` 与 React 2.10 同步导出：忽略每次解析都会变化的 `domNode`，浅比较其余 props。Vue 没有和 `React.memo` 同名的公开 render bailout API，因此它适合放在你自己的缓存层或第三方渲染适配器里使用；流式场景减少重复解析优先使用 `incremental`。

```ts
import { arePropsEqualIgnoringDomNode } from '@ant-design-x-vue/x-markdown';

const unchanged = arePropsEqualIgnoringDomNode(previousProps, nextProps);
```

### 未完成语法转换

当 `hasNextChunk` 为 `true` 且 `incompleteMarkdown` 为 `placeholder`（默认）时，未完成的语法 token 会转成 `incomplete-<token>` 形式，原文通过 `data-raw` 返回（`encodeURIComponent`）。`incompleteMarkdown: 'complete'` 时，强调 / 行内代码 / 链接文字 / 列表项会尽量当作已完成文本立刻显示；图片、HTML、表格仍走占位逻辑。

可用 `incompleteMarkdownComponentMap` 把默认标签名换成自定义名（例如 `link: 'link-loading'`），再在 `components` 里注册对应组件。显式配置的映射优先于 `complete` 模式。

### StreamCacheTokenType

与 React `@ant-design/x-markdown@2.10` 源码枚举一致：

```ts
type StreamCacheTokenType =
  | 'text' // 纯文本（不生成占位标签）
  | 'link' // 链接 [text](url)
  | 'image' // 图片 ![alt](src)
  | 'html' // HTML / 自定义标签 <tag>
  | 'emphasis' // 强调 *斜体* **粗体**
  | 'list' // 列表 - + *
  | 'table' // 表格 | header | content |
  | 'inline-code'; // 行内代码 `code`
```

### 支持的语法类型

| 语法类型 | 格式示例 | 处理机制 | 未完成示例 | TokenType |
| --- | --- | --- | --- | --- |
| **Link** | `[text](url)` | 检测未闭合的链接标记 | `[Example](https://example` | `link` |
| **Image** | `![alt](src)` | 检测未闭合的图片标记 | `![Product](https://cdn.example.com/images/produc` | `image` |
| **HTML** | `<tag>` | 处理 HTML / 自定义标签闭合状态 | `<div class="` | `html` |
| **Emphasis** | `*italic*` `**bold**` | 处理 `*` / `_` 强调未闭合 | `**Unfinished bold` | `emphasis` |
| **List** | `- + *` | 检测列表标记后的空格 | `-` | `list` |
| **Table** | [GFM 表格](https://github.github.com/gfm/#tables-extension-) | 检测未闭合的表格行 / 单元格 | `\| Header1 \| Header2 \|` | `table` |
| **Inline code** | `` `code` `` | 检测未闭合的行内代码 | `` `partial `` | `inline-code` |

### 最小配置示例

```vue
<script setup lang="ts">
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const content = '...';
const isStreaming = true;
</script>

<template>
  <!-- 布尔预设：incremental + incompleteMarkdown:complete + typewriter -->
  <XMarkdown :content="content" :streaming="isStreaming" />

  <!-- 或对象形式细调 -->
  <XMarkdown
    :content="content"
    :streaming="{
      hasNextChunk: isStreaming,
      enableAnimation: true,
      tail: true,
      incompleteMarkdown: 'complete',
    }"
  />
</template>
```

## FAQ

### 为什么需要流式语法处理？

流式传输时 Markdown 可能停在半截状态，例如：

```markdown
[Example Website](https://example
![Product Image](https://cdn.example.com/images/produc
```

未完成结构可能导致链接无法跳转、图片加载失败，或格式标记直接显示在正文里。

### 为什么不应该一直让 hasNextChunk 为 true？

`hasNextChunk` 不应始终为 `true`，否则会出现：

1. **语法一直挂起**：未闭合的链接、图片等会一直停留在 loading / 占位状态
2. **体验变差**：用户只看到持续加载，拿不到完整内容
3. **状态堆积**：缓存与占位状态无法正常收尾清理

布尔预设下，把 `streaming` 从 `true` 切到 `false` 即可结束流并按最终内容渲染（`keepSectionsOnEnd` 默认保持已切段，避免已挂载自定义组件重新挂载）。
