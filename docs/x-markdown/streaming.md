# XMarkdown 流式语法

流式语法专门处理「半截 Markdown」：在 `hasNextChunk` 为 `true` 时识别未闭合结构，并通过 `incompleteMarkdownComponentMap` / 默认 `incomplete-*` 标签做占位，避免把半截链接、表格等直接当完整 Markdown 解析。

## 代码演示

:::demo-v2 上方切换 Mixed / Link / Image / Html / Table / Emphasis / InlineCode，左边是正在打出的源码，右边是渲染结果。没写完的链接显示 16px 占位图标，而不是原始 `[text](url`。Re-Render / Run Stream 会重头打字并打开淡入。

x-markdown/streaming-syntax

:::

:::demo-v2 也可以只用布尔 `streaming`，配合逐字输出看淡入效果。

x-markdown/animation

:::

## API

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| **hasNextChunk** | 后面是否还有数据。为 `false` 时刷新缓存并完成渲染 | `boolean` | `false` |
| **enableAnimation** | 启用文字淡入动画 | `boolean` | `false` |
| **animationConfig** | 文字动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| **incompleteMarkdownComponentMap** | 未完成语法要用的组件名。流式输出含未闭合表格、链接等时，可指定占位 / loading 组件名 | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |

### AnimationConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fadeDuration | 淡入时长（毫秒） | `number` | `200` |
| easing | 缓动函数 | `string` | `'ease-in-out'` |

### 未完成语法转换

当 `hasNextChunk` 为 `true` 时，未完成的语法 token 会转成 `incomplete-<token>` 形式，原文通过 `data-raw` 返回（`encodeURIComponent`）。token 类型为 `StreamCacheTokenType`。例如：

- 未完成链接 `[Example](https://example.com` → `<incomplete-link data-raw="...">`
- 未完成图片 `![Product](https://cdn.example.com/images/produc` → `<incomplete-image data-raw="...">`
- 未完成 HTML `<div class="` → `<incomplete-html data-raw="...">`

可用 `incompleteMarkdownComponentMap` 把默认标签名换成自定义名（例如 `link: 'link-loading'`），再在 `components` 里注册对应组件。

### StreamCacheTokenType

与 Vue / React `@ant-design/x-markdown@2.0.0` 源码枚举一致：

```ts
type StreamCacheTokenType =
  | 'text' // 纯文本（不生成占位标签）
  | 'link' // 链接 [text](url)
  | 'image' // 图片 ![alt](src)
  | 'html' // HTML / 自定义标签 <tag>
  | 'emphasis' // 强调 *斜体* **粗体**
  | 'list' // 列表 - + *
  | 'table'; // 表格 | header | content |
```

> 注意：2.0.0 **没有** `heading` / `xml` token，也没有 `streaming.tail` 或 `debug` 配置项。尾标、性能面板如需展示，请在业务层自行绘制。

### 支持的语法类型

| 语法类型 | 格式示例 | 处理机制 | 未完成示例 | TokenType |
| --- | --- | --- | --- | --- |
| **Link** | `[text](url)` | 检测未闭合的链接标记 | `[Example](https://example` | `link` |
| **Image** | `![alt](src)` | 检测未闭合的图片标记 | `![Product](https://cdn.example.com/images/produc` | `image` |
| **HTML** | `<tag>` | 处理 HTML / 自定义标签闭合状态 | `<div class="` | `html` |
| **Emphasis** | `*italic*` `**bold**` | 处理 `*` / `_` 强调未闭合 | `**Unfinished bold` | `emphasis` |
| **List** | `- + *` | 检测列表标记后的空格 | `-` | `list` |
| **Table** | [GFM 表格](https://github.github.com/gfm/#tables-extension-) | 检测未闭合的表格行 / 单元格 | `\| Header1 \| Header2 \|` | `table` |

### 自定义未完成语法组件

```vue
<script setup lang="ts">
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Skeleton } from 'ant-design-vue';

const ImageSkeleton = () =>
  h(Skeleton.Image, { active: true, style: { width: 60, height: 60 } });

const IncompleteLink = (props: ComponentProps) => {
  const text = decodeURIComponent(String(props['data-raw'] || ''));
  const linkTextMatch = text.match(/^\[([^\]]*)\]/);
  const displayText = linkTextMatch ? linkTextMatch[1] : text.slice(1);
  return h('a', { style: { pointerEvents: 'none' }, href: '#' }, displayText);
};

const hasNextChunk = true;
</script>

<template>
  <XMarkdown
    content="Visit [Ant Design](https://ant.design) …"
    :streaming="{
      hasNextChunk,
      incompleteMarkdownComponentMap: { link: 'link-loading' },
    }"
    :components="{
      'link-loading': ImageSkeleton,
      'incomplete-link': IncompleteLink,
    }"
  />
</template>
```

完整可运行示例见上方「流式语法」演示。

## FAQ

### 为什么需要流式语法处理？

流式传输时 Markdown 可能停在半截状态，例如：

```markdown
[Example Website](https://example
![Product Image](https://cdn.example.com/images/produc
```

未完成结构可能导致：

- 链接无法正确跳转
- 图片加载失败
- 格式标记直接显示在正文里

### 为什么不应该一直让 hasNextChunk 为 true？

`hasNextChunk` 不应始终为 `true`，否则会出现：

1. **语法一直挂起**：未闭合的链接、图片等会一直停留在 loading / 占位状态
2. **体验变差**：用户只看到持续加载，拿不到完整内容
3. **状态堆积**：缓存与占位状态无法正常收尾清理
