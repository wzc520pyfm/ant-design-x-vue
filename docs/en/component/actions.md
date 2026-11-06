
# Actions

Used to quickly configure action buttons/functions required in some AI scenarios.

## When to use

The Actions component is used to quickly configure action buttons/functions required in some AI scenarios.

## Examples

### Basic

<ClientOnly>

:::demo-v2 Basic usage.

actions/basic

:::

</ClientOnly>

### More menu items

<ClientOnly>

:::demo-v2 Nested menu items and custom click events.

actions/sub

:::

</ClientOnly>

### Preset templates

<ClientOnly>

:::demo-v2 uses pre-set capabilities such as `Actions.Feedback`, `Actions.Copy`, `Actions.Audio`, `Actions.Item`, etc.

actions/preset

:::

</ClientOnly>

### Variants

<ClientOnly>

:::demo-v2 uses the `variant` property to set different style variants.

actions/variant

:::

</ClientOnly>

### Fade-in effect

<ClientOnly>

:::demo-v2 enables fade-in rendering through `fadeIn` / `fadeInLeft`.

actions/fadeIn

:::

</ClientOnly>


Mobile behavior: internally uses `useMobile` for SSR-safe device detection. On mobile devices, action items and `Actions.Feedback` no longer render tooltips (to prevent click-through), and items with submenus default to being triggered by `click` (can still be overridden via `triggerSubMenuAction`).

`useMobile` can also be imported directly from `ant-design-x-vue`.

```ts | pure
import { useMobile } from 'ant-design-x-vue';

const isMobile = useMobile(); // Ref<boolean>，服务端与首屏为 false，挂载后更新
```

## API

General properties reference: [General Properties](/en/development/common-props).

### ActionsProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | List containing multiple action items | [ItemType](#itemtype)[] | - | - |
| onClick | Callback function when the component is clicked | `function({ item, key, keyPath, domEvent })` | - | - |
| dropdownProps | Configuration properties of the dropdown menu | DropdownProps | - | - |
| variant | Variant | `borderless` \| `outlined` \| `filled` | `borderless` | - |
| fadeIn | Enable fade-in on render | boolean | - | - |
| fadeInLeft | Enable left-to-right fade-in | boolean | - | - |
| rootClassName | Root class name | string | - | - |
| className | Outer className | string | - | - |
| style | Root style | CSSProperties | - | - |
| classNames | Semantic class names | Record\<SemanticType, string\> | - | - |
| styles | Semantic styles | Record\<SemanticType, CSSProperties\> | - | - |
| prefixCls | Class name prefix | string | - | - |

`block` is deprecated, please use `variant`.

### ItemType

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier for the custom action | string | - | - |
| label | Display label for the custom action | string | - | - |
| icon | Icon for the custom action | VNodeChild | - | - |
| onItemClick | Callback when the custom action button is clicked | (info?: [ItemType](#itemtype)) => void | - | - |
| danger | Syntactic sugar to set a dangerous style | boolean | false | - |
| subItems | Sub-action items | Omit< ItemType, 'subItems' | 'triggerSubMenuAction' | 'actionRender'\>[] | - | - |
| triggerSubMenuAction | Action to trigger the sub-menu. Defaults to `hover` on desktop and `click` on mobile | `hover` | `click` | Desktop `hover` / Mobile `click` | - |
| actionRender | Custom render content for the action item | ((item: [ItemType](#itemtype)) => VNodeChild) | VNodeChild | - | - |

### Actions.Feedback

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | Feedback status value | `like` | `dislike` | `default` | `default` | - |
| onChange | Callback for feedback status change | (value: `like` | `dislike` | `default`) => void | - | - |

### Actions.Copy

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| text | Text to be copied | string | `''` | - |
| icon | Copy button icon | VNodeChild | - | - |

### Actions.Audio

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| status | Playback status | `loading` \| `error` \| `running` \| `default` | `default` | - |

### Actions.Item

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| status | Status | `loading` \| `error` \| `running` \| `default` | `default` | - |
| label | Display label for the custom action | string | - | - |
| defaultIcon | Default state icon | VNodeChild | - | - |
| runningIcon | Running state icon | VNodeChild | - | - |

## Semantic DOM

<vp-semantic component="Actions"></vp-semantic>

> `Actions.Feedback` also supports semantic structure: `root` / `like` / `liked` / `dislike` / `disliked`. `Actions.Copy` / `Actions.Audio` / `Actions.Item` currently only expose root-level style properties, with no additional semantic slots.

## Design Token

This component has no custom Component Token. Customize it through global Design Tokens.

## Contributors

<doc-contributors component-name="actions" :max-count="50" :show-view-all="true" />
