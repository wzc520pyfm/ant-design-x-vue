# Overview

`components` can replace standard HTML tags or custom tags with Vue components. In conversation scenarios, tags are often handed to Think, Sources, or ThoughtChain; code blocks are handed to HighlightCode / Mermaid; you can also map your own chart tags.

Related pages:

- [Conversation Think · Sources · ThoughtChain](/en/x-markdown/chat-enhancement)
- [Charts Mermaid · GPT-VIS](/en/x-markdown/data-display)
- [Highlight Code](/en/x-markdown/rich-text)
- [Plugin Collection](/en/x-markdown/plugins)

## Basic usage

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

Demo:

:::demo-v2 Map HTML tags to custom Vue components through `components`, which can receive props like `domNode`, `streamStatus`, `children`, etc.

x-markdown/components

:::

## Performance tips

### 1. Avoid defining components inline in render functions

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

### 2. Keep `components` references stable

Create the `components` object once inside `setup`, or use `computed` / constants to avoid creating a new object on every parent component update, which causes unnecessary re-rendering of child subtrees.

### 3. Pass business data through `componentsProps`

Custom components often require business data (theme, callbacks, etc.). If you wrap it in an inline function and pass it as props, a new component reference is created on every render, causing repeated unmounting and rebuilding in streaming scenarios. Use `componentsProps` to pass additional props by tag name, and keep the `components` reference stable:

```ts
const components = { 'custom-chart': CustomChart };
const componentsProps = computed(() => ({
  'custom-chart': { theme: theme.value, onSelect },
}));

h(XMarkdown, { components, componentsProps: componentsProps.value, content });
```

Merging rules (aligned with React `@ant-design/x-markdown@2.10`):

- Attributes with the same name are determined by `componentsProps` (for example, overriding `title` on HTML)
- `className` / `class` will be concatenated, with class names from `componentsProps` coming first
- Internally computed `domNode`, `streamStatus`, `children` (and `lang`, `block` for `code`) cannot be overridden


## Streaming render and streamStatus

XMarkdown will pass `streamStatus` to custom components, indicating whether the tag has been closed, which is useful for implementing loading UI.

```ts
const StreamingComponent = (props: { streamStatus?: 'loading' | 'done'; children?: unknown }) => {
  if (props.streamStatus === 'loading') {
    return h('div', { class: 'loading' }, 'Loading...');
  }
  return h('div', null, props.children as any);
};
```

### Status checks

- `loading`: the content of this block is still being streamed (common for custom HTML tags or fenced code)
- 'done': This block is closed. Indent code blocks have no clear terminator and are always 'done'
- 'code' can also distinguish between block-level and inline by 'data-state' / 'block'

## Data fetching example

Components can read data directly from the Markdown property or send a request after 'streamStatus === 'done'':

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

## Supported tag mapping

### Standard HTML tags

| Tag | Component Name |
| --- | --- |
| `a` | `a` |
| `h1`–`h6` | `h1`–`h6` |
| `p` | `p` |
| `img` | `img` |
| `table` | `table` |
| `ul` / `ol` / `li` | `ul` / `ol` / `li` |
| `code` / `pre` | `code` / `pre` |

### Custom tags

```ts
// 任意自定义标签都可以映射
// <XMarkdown :components="{ 'my-component': MyComponent, 'user-card': UserCard }" />
```

## ComponentProps

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Parsed DOM Node Information | `DOMNode` | - |
| streamStatus | 'loading' / 'done', see above | `'loading' \| 'done'` | - |
| children | Subcontent | `VNode[] \| string` | - |
| The rest | Standard HTML properties vs. custom data properties | `Record\<string, any\>` | - |

For more general tables, see [Code Example · API](/en/x-markdown/examples)。
