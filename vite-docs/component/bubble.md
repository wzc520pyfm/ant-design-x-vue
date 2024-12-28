<script setup>
import BubbleBasic from '@ant-design-x-vue/bubble/demo/basic.vue'
import BubbleAvatarAndPlacement from '@ant-design-x-vue/bubble/demo/avatar-and-placement.vue'
import BubbleHeaderAndFooter from '@ant-design-x-vue/bubble/demo/header-and-footer.vue'
import BubbleLoading from '@ant-design-x-vue/bubble/demo/loading.vue'
import BubbleTyping from '@ant-design-x-vue/bubble/demo/typing.vue'
import BubbleMarkdown from '@ant-design-x-vue/bubble/demo/markdown.vue'
import BubbleVariant from '@ant-design-x-vue/bubble/demo/variant.vue'
import BubbleShape from '@ant-design-x-vue/bubble/demo/shape.vue'
import BubbleList from '@ant-design-x-vue/bubble/demo/list.vue'
import BubbleCustom from '@ant-design-x-vue/bubble/demo/bubble-custom.vue'
import BubbleListCustom from '@ant-design-x-vue/bubble/demo/list-custom.vue'
import BubbleGptVis from '@ant-design-x-vue/bubble/demo/gpt-vis.vue'
</script>

# Bubble 对话气泡

用于聊天的气泡组件。

## 何时使用

常用于聊天的时候。

## 代码演示

### 基本

基础用法。

<BubbleBasic />

### 支持位置和头像

通过 `avatar` 设置自定义头像，通过 `placement` 设置位置，提供了 `start`、`end` 两个选项。

<BubbleAvatarAndPlacement />

### 头和尾

通过 `header` 和 `footer` 属性设置气泡的头部和底部。

<BubbleHeaderAndFooter />

### 加载中

通过 `loading` 属性控制加载状态。

<BubbleLoading />

### 打字效果

通过设置 `typing` 属性，开启打字效果。更新 `content` 如果是之前的子集，则会继续输出，否则会重新输出。

<BubbleTyping />

### 自定义渲染

配合 `markdown-it` 实现自定义渲染内容。

<BubbleMarkdown />

### 变体

通过 `variant` 属性设置气泡的样式变体。

<BubbleVariant />

### 形状

通过 `shape` 属性设置气泡的形状。

<BubbleShape />

### 气泡列表

预设样式的气泡列表，支持自动滚动。使用 `roles` 设置气泡默认属性。

<BubbleList />

### 语义化自定义

示例通过语义化以及加载定制，来调整气泡效果。

<BubbleCustom />

### 自定义列表内容

自定义气泡列表内容，这对于个性化定制场景非常有用。

<BubbleListCustom />

### 使用 GPT-Vis 渲染图表 (no support)

@antv/GPT-Vis 仅支持React。

~~配合 @antv/GPT-Vis 实现大模型输出的图表渲染，支持模型流式输出。~~

<BubbleGptVis />


## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### Bubble

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| avatar | 展示头像 | VNode | - |  |
| classNames | 语义化结构 class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| content | 聊天内容 | string | - |  |
| footer | 底部内容 | VNode | - |  |
| header | 头部内容 | VNode | - |  |
| loading | 聊天内容加载状态 | boolean | - |  |
| placement | 信息位置 | `start` \| `end` | `start` |  |
| shape | 气泡形状 | `round` \| `corner` | - |  |
| styles | 语义化结构 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| typing | 设置聊天内容打字动画 | boolean \| \{ step?: number, interval?: number \} | false |  |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `filled` |  |
| loadingRender | 自定义渲染加载态内容 | () => VNode | - |  |
| messageRender | 自定义渲染内容 | (content?: string) => VNode | - |  |
| onTypingComplete | 打字效果完成时的回调，如果没有设置 typing 将在渲染时立刻触发 | () => void | - |  |

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoScroll | 当内容更新时，自动滚动到最新位置。如果用户滚动，则会暂停自动滚动。 | boolean | true |  |
| items | 气泡数据列表 | (BubbleProps & { key?: string \| number, role?: string })[] | - |  |
| roles | 设置气泡默认属性，`items` 中的 `role` 会进行自动对应 | Record<string, BubbleProps> \| (bubble) => BubbleProps | - |  |

## Semantic DOM

<!-- <code src="./demo/_semantic.tsx" simplify="true"></code> -->

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Bubble"></ComponentTokenTable> -->