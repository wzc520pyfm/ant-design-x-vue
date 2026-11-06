# Prompts

Used to display a set of predefined questions or suggestions related to the current context.

## Examples

### Basic

<ClientOnly>

:::demo-v2 Basic usage.

prompts/basic

:::

</ClientOnly>

### Disabled state

:::demo-v2 To disable a prompt, add the `disabled` attribute to the prompt.

prompts/disabled

:::

### Fade-in effect

:::demo-v2 Controls fade-in animation effects using the `fadeIn` and `fadeInLeft` attributes.

prompts/fadeIn

:::

### Vertical layout

:::demo-v2 Uses the `vertical` attribute to control the display direction of Prompts.

prompts/flex-vertical

:::

### Wrap

:::demo-v2 Use the `wrap` property to control whether Prompts can wrap when exceeding the container length.

prompts/flex-wrap

:::

### Responsive width

:::demo-v2 Use `wrap` together with `styles` to display at a fixed width.

prompts/flex-wrap-fixed

:::

### Nested composition

<ClientOnly>

:::demo-v2 Nested composition.

prompts/nest

:::

</ClientOnly>


Accessibility: When `onItemClick` is passed in, clickable prompt items will render as native `button`s, can be focused with Tab, and activated with Enter / Space; `disabled` items will have the `disabled` attribute. Nested parent items and lists without `onItemClick` will still render as `div`s to avoid invalid buttons.

## API

### PromptsProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names, used for different parts of each prompt item | Record\<SemanticType, string\> | - | - |
| fadeIn | Enable fade-in on render | boolean | `false` | - |
| fadeInLeft | Whether to enable rendering with a left-to-right fade-in | boolean | `false` | - |
| items | List containing multiple prompt items | PromptProps[] | - | - |
| prefixCls | Prefix for style class names | string | - | - |
| rootClassName | Root class name | string | - | - |
| styles | Custom styles, used for different parts of each prompt item | Record\<SemanticType, CSSProperties\> | - | - |
| title | Title displayed at the top of the prompt list | VNode \| string \| (() => VNode \| string) | - | - |
| vertical | When set to `true`, the prompt list will be arranged vertically | boolean | `false` | - |
| wrap | When set to `true`, the prompt list will automatically wrap | boolean | `false` | - |
| onItemClick | Callback function when a prompt item is clicked. If passed, clickable items are rendered as `button`s and support keyboard activation | (info: { data: PromptProps }) => void | - | - |

#### SemanticType

```typescript | pure
type SemanticType = 'root' | 'list' | 'item' | 'itemContent' | 'title' | 'subList' | 'subItem';
```

### Prompts Slots

| Slot | Description |
| --- | --- |
| title | The title displayed at the top of the prompt list |

### Prompts Ref

| Prop | Description | Type |
| --- | --- | --- |
| nativeElement | The root DOM element of the component | HTMLDivElement |

### PromptProps

| Property   | Description                        | Type            | Default | Version |
| ----------- | ---------------------------- | --------------- | ------- | ---- |
| children    | Nested sub-prompt items            | PromptProps[]   | -       | -      |
| description | Prompt description providing additional information | VNode | string | -       | -      |
| disabled    | Disables click events when set to `true` | boolean | `false` | -      |
| icon        | The prompt icon displayed on the left side of the prompt item | VNode | -       | -      |
| key         | Unique identifier used to distinguish each prompt item | string | -       | -      |
| label       | Prompt label displaying the main content of the prompt | VNode | string | -       | -      |

## Semantic DOM

<vp-semantic component="Prompts"></vp-semantic>

## Design Token

This component has no custom Component Token. Customize it through global Design Tokens.

