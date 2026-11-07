
# Welcome

Clearly convey to users the achievable scope and expected functions.

## When to use

Using appropriate welcome recommendation components can effectively reduce the user's learning cost, allowing them to quickly understand and get started smoothly.

## Examples

### Basic

:::demo-v2 Basic usage.

welcome/basic

:::

### Variant

:::demo-v2 Sets style variants through the `variant` property.

welcome/variant

:::

### Custom background

:::demo-v2 Customize some styles.

welcome/background

:::

## API

### WelcomeProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names, used for various parts. | Record\<SemanticType, string\> | - | - |
| description | Description content. | VNode | string | (() => VNode | string) | - | - |
| extra | Additional operation content. | VNode | string | (() => VNode | string) | - | - |
| icon | Icon, supports passing a URL string to automatically render as an image. | VNode | string | (() => VNode | string) | - | - |
| rootClassName | Root class name。 | string | - | - |
| styles | Custom styles, used for various parts. | Record\<SemanticType, CSSProperties\> | - | - |
| title | Title content. | VNode | string | (() => VNode | string) | - | - |
| variant | Variant type. | 'filled' | 'borderless' | 'filled' | - |

### Welcome Slots

| Slot | Description |
| --- | --- |
| title | Title content |
| description | Description content |
| icon | Icon content |
| extra | Extra operation content |

### SemanticType

| Name | Description |
| --- | --- |
| root | Root node |
| title | Title |
| description | Description |
| icon | Icon |
| extra | Extra content |

## Semantic DOM

<vp-semantic component="Welcome"></vp-semantic>

## Design Token

This component has no custom Component Token. Customize it through global Design Tokens.

## Contributors

<doc-contributors component-name="welcome" :max-count="50" :show-view-all="true" />
