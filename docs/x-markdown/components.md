# 总览

`components` 可以把标准 HTML 标签或自定义标签替换成 Vue 组件。对话场景里常把标签交给 Think、Sources、ThoughtChain；代码块交给 HighlightCode / Mermaid；也可以映射自己的图表标签。

相关页面：

- [对话 Think · Sources · ThoughtChain](/x-markdown/chat-enhancement)
- [图表 Mermaid · GPT-VIS](/x-markdown/data-display)
- [高亮 Code](/x-markdown/rich-text)
- [插件集](/x-markdown/plugins)

## 基本用法

```ts
import { defineComponent, h } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const CustomHeading = defineComponent({
  setup(_, { slots }) {
    return () => h('h1', { style: { color: '#1890ff' } }, slots.default?.());
  },
});

// <XMarkdown content="# Hello World" :components="{ h1: CustomHeading }" />
```

演示：

:::demo-v2 通过 `components` 将 HTML 标签映射为自定义 Vue 组件，可接收 `domNode`、`streamStatus`、`children` 等 props。

x-markdown/components

:::

## 性能建议

### 1. 避免在渲染函数里内联定义组件

```ts
// ❌ 每次渲染都会创建新组件引用
h(XMarkdown, {
  components: {
    h1: (props) => h('h1', props, props.children),
  },
});

// ✅ 在模块或 setup 外预先定义
const Heading = (props) => h('h1', props, props.children);
h(XMarkdown, { components: { h1: Heading } });
```

### 2. 稳定 components 引用

把 `components` 对象放在 `setup` 里一次创建，或用 `computed` / 常量，避免父组件每次更新都换新对象，导致子树不必要地重渲染。

### 3. 用 componentsProps 传业务数据

自定义组件常常需要业务数据（主题、回调等）。若用内联函数包一层再塞 props，每次渲染都会产生新组件引用，流式场景下会反复卸载重建。用 `componentsProps` 按标签名传额外 props，并保持 `components` 引用稳定：

```ts
const components = { 'custom-chart': CustomChart };
const componentsProps = computed(() => ({
  'custom-chart': { theme: theme.value, onSelect },
}));

h(XMarkdown, { components, componentsProps: componentsProps.value, content });
```

合并规则（对齐 React `@ant-design/x-markdown@2.10`）：

- 同名属性以 `componentsProps` 为准（例如覆盖 HTML 上的 `title`）
- `className` / `class` 会拼接，`componentsProps` 的类名在前
- 内部计算的 `domNode`、`streamStatus`、`children`（以及 `code` 的 `lang`、`block`）不可覆盖


## 流式渲染与 streamStatus

XMarkdown 会把 `streamStatus` 传给自定义组件，表示该标签是否已经闭合，便于做 loading UI。

```ts
const StreamingComponent = (props: { streamStatus?: 'loading' | 'done'; children?: unknown }) => {
  if (props.streamStatus === 'loading') {
    return h('div', { class: 'loading' }, 'Loading...');
  }
  return h('div', null, props.children as any);
};
```

### 状态判定

- `loading`：该块内容仍在流式输出（常见于自定义 HTML 标签、围栏代码）
- `done`：该块已闭合。缩进代码块没有明确结束符，始终为 `done`
- `code` 也可通过 `data-state` / `block` 区分块级与行内

## 数据获取示例

组件既可以直接从 Markdown 属性读数据，也可以在 `streamStatus === 'done'` 后再发请求：

```ts
import { ref, watchEffect } from 'vue';

const UserCard = {
  props: ['domNode', 'streamStatus'],
  setup(props) {
    const user = ref(null);
    watchEffect(async () => {
      const username = props.domNode?.attribs?.['data-username'];
      if (username && props.streamStatus === 'done') {
        user.value = await fetch(`/api/users/${username}`).then((r) => r.json());
      }
    });
    return () =>
      user.value
        ? h('div', { class: 'user-card' }, user.value.name)
        : h('div', null, 'Loading...');
  },
};
```

## 支持的标签映射

### 标准 HTML 标签

| 标签 | 组件名 |
| --- | --- |
| `a` | `a` |
| `h1`–`h6` | `h1`–`h6` |
| `p` | `p` |
| `img` | `img` |
| `table` | `table` |
| `ul` / `ol` / `li` | `ul` / `ol` / `li` |
| `code` / `pre` | `code` / `pre` |

### 自定义标签

```ts
// 任意自定义标签都可以映射
// <XMarkdown :components="{ 'my-component': MyComponent, 'user-card': UserCard }" />
```

## ComponentProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | 解析后的 DOM 节点信息 | `DOMNode` | - |
| streamStatus | `loading` / `done`，见上文 | `'loading' \| 'done'` | - |
| children | 子内容 | `VNode[] \| string` | - |
| 其余 | 标准 HTML 属性与自定义 data 属性 | `Record<string, any>` | - |

更多总表见 [代码示例 · API](/x-markdown/examples)。
