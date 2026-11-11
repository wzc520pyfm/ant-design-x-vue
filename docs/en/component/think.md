# Think

Display the deep thinking process of the large model.

## When to use

- Used to display the deep thinking process of the large model during conversations.

## Examples

### Basic usage

:::demo-v2 Basic usage.

think/basic

:::

### Set status

:::demo-v2 Customize status text and icons.

think/status

:::

### Expanded state

:::demo-v2 Control expand/collapse.

think/expand

:::

### Destroy on collapse

:::demo-v2 Whether to destroy content when collapsed.

think/destroyOnHidden

:::

## API

### ThinkProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | CSS class names | `Record\<SemanticDOM, string\>` | - | - |
| styles | Style | `Record\<SemanticDOM, CSSProperties\>` | - | - |
| title | Status Text | `VNode | string` | - | - |
| icon | Status Icon | `VNode` | - | - |
| loading | Loading | `boolean | VNode` | `false` | - |
| defaultExpanded | Default Expand | `boolean` | `true` | - |
| expanded | Whether Expanded | `boolean` | - | - |
| onExpand | Expand Event | `(expand: boolean) => void` | - | - |
| blink | Blink Mode | `boolean` | - | - |
| destroyOnHidden | Whether to Destroy Content Node When Hidden | `boolean` | `true` | - |

### Slots

| Name | Description |
| --- | --- |
| default | Thinking Content |
| title | Custom Status Text |
| icon | Custom Status Icon |

## Semantic DOM

<vp-semantic component="Think"></vp-semantic>

## Design Token

| Token | Description | Type | Default |
| --- | --- | --- | --- |
| colorTextBlinkDefault | Default Typing Animation Color | string | `colorTextDescription` |
| colorTextBlink | Typing animation color | string | `colorTextBase` |

