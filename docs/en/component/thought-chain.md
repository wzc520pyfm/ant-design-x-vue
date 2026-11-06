
# ThoughtChain

The Thought Chain component is used to visualize and track the call chain of an Agent to Actions and Tools.

## When to use

* Debug and track call chains in complex Agent Systems
* Used in similar chain-like scenarios

## Examples

### Basic

:::demo-v2 Basic usage.

thought-chain/basic

:::

### ThoughtChain.Item

:::demo-v2 ThoughtChain.Item is an independent compact component that supports three variants: `solid`, `outlined`, and `text`, as well as four states: `loading`, `success`, `error`, and `abort`.

thought-chain/simple

:::

### Node status

:::demo-v2 Thought chain nodes support configuring the `status` property to clearly indicate the current execution status of the node.

thought-chain/status

:::

### Collapsible

:::demo-v2 Configuring the `collapsible` and `defaultExpandedKeys` of an item enables the folding functionality of the content area of a thought chain node.

thought-chain/collapsible

:::

### Controlled mode

:::demo-v2 Controlled mode is achieved through `expandedKeys` and `onExpand`.

thought-chain/controlled-collapsible

:::

### Destroy on collapse

:::demo-v2 Whether to destroy content when collapsed.

thought-chain/destroyOnHidden

:::

### Customization

:::demo-v2 The `items` property supports flexible customization, including custom icons, footnotes, nested Think components, etc. Supports `line="dashed"` for dashed line style.

thought-chain/customization

:::

### Nested usage

:::demo-v2 ThoughtChain supports nesting.

thought-chain/nested

:::

### Single-line collapse

:::demo-v2 Hide icons with `icon: false` and use custom `styles.itemContent` to achieve a single-line folding effect.

thought-chain/single-row

:::

## API

### ThoughtChainProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Collection of thought nodes | ThoughtChainItemType[] | - | - |
| defaultExpandedKeys | Initially expanded nodes | string[] | - | - |
| expandedKeys | Currently expanded nodes | string[] | - | - |
| onExpand | Callback for node expansion change | (expandedKeys: string[]) => void | - | - |
| line | Line style | boolean | 'solid' | 'dashed' | 'dotted' | true | - |
| classNames | Class names for semantic structure | Record\<SemanticType, string\> | - | - |
| styles | Styles for semantic structure | Record\<SemanticType, CSSProperties\> | - | - |
| prefixCls | Custom prefix | string | - | - |
| rootClassName | Custom root class name | string | - | - |

### ThoughtChainItemType

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier for mind node | string | - | - |
| icon | Icon for mind node, set to false to hide | VNode | string | number | false | index+1 | - |
| title | Mind node title | VNode | string | - | - |
| description | Mind node description | VNode | string | - | - |
| content | Mind node content | VNode | string | - | - |
| footer | Mind node footer note | VNode | string | - | - |
| status | Mind node status | 'loading' | 'success' | 'error' | 'abort' | - | - |
| collapsible | Whether it is collapsible | boolean | - | - |
| blink | Blink animation | boolean | - | - |
| destroyOnHidden | Whether to destroy content node when hidden | boolean | true | - |

### ThoughtChain.Item Props

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| variant | Variant | 'solid' | 'outlined' | 'text' | 'solid' | - |
| icon | Icon | VNode | string | - | - |
| title | Title | VNode | string | - | - |
| description | Description | VNode | string | - | - |
| status | Status | 'loading' | 'success' | 'error' | 'abort' | - | - |
| blink | Blink animation | boolean | - | - |
| onClick | Click event | () => void | - | - |
| classNames | Semantic structure class names | Record<'root' | 'icon' | 'title' | 'description', string\> | - | - |
| styles | Semantic structure styles | Record<'root' | 'icon' | 'title' | 'description', CSSProperties\> | - | - |

### SemanticType

| Name | Description |
| --- | --- |
| root | Root node |
| item | Node item |
| itemHeader | Node header |
| itemIcon | Node icon |
| itemContent | Node content |
| itemFooter | Node footer |

## Semantic DOM

The preview sequentially displays the semantic structure of `ThoughtChain` and `ThoughtChain.Item`.

<vp-semantic component="ThoughtChain"></vp-semantic>

## Design Token

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| itemSolidBg | ThoughtChain.Item solid background color | string | colorFillTertiary |
| itemSolidHoverBg | ThoughtChain.Item solid hover background color | string | colorBgTextHover |
| itemOutlinedBg | ThoughtChain.Item outlined background color | string | colorBgContainer |
| itemOutlinedHoverBg | ThoughtChain.Item outlined hover background color | string | colorBgTextHover |
| itemBorderRadius | ThoughtChain.Item border radius | number | borderRadius |
| iconSize | Icon container size | number | fontSize |
| colorTextBlinkDefault | Default typing animation color | string | colorTextDescription |
| colorTextBlink | Typing animation color | string | colorTextBase |
| itemMotionDescription | Effect description text color (semi-transparent) | string | `rgba(colorTextDescription, 0.25)` |
