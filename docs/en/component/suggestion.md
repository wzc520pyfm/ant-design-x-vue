# Suggestion

Components used to provide users with quick prompts.

## When to use

Need to build an input box for a dialogue scenario.

## Examples

### Basic usage

<ClientOnly>

:::demo-v2 Basic controlled usage with a custom trigger.

suggestion/basic

:::

</ClientOnly>

### Full-row width

<ClientOnly>

:::demo-v2 Use `block` for a full-row layout; `extra` adds more info.

suggestion/block

:::

</ClientOnly>

### Custom

<ClientOnly>

:::demo-v2 A multi-tag example that updates suggestions from input.

suggestion/trigger

:::

</ClientOnly>

## API

### SuggestionsProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Is the width of the entire line | boolean | false | - |
| children | Custom input box | ({ onTrigger, onKeyDown }) => VNode | - | - |
| items | Suggested List | SuggestionItem[] \| ((info: T) => SuggestionItem[]) | - | - |
| open | Controlled Open Panel | boolean | - | - |
| rootClassName | Root element style class name | string | - | - |
| onSelect | Select Suggestion Item Pullback | (value: string) => void | - | - |
| onOpenChange | Callback for panel open state changes | (open: boolean) => void | - | - |

#### onTrigger

```typescript | pure
type onTrigger<T> = (info: T | false) => void;
```

Suggestion accepts generics to customize the parameter type passed to the `items` renderProps. When `false` is passed, the suggestion panel is closed.

### Suggestions Slots

| Slot | Description | Type |
| --- | --- | --- |
| default | Used to customize the input box | { onTrigger, onKeyDown } |

### SuggestionItem

| Property | Description | Type | Default | Version |
| -------- | -------------- | ---------------- | ------ | ---- |
| children | Sub-items | SuggestionItem[] | - | - |
| extra | Extra content of the suggestion item | VNode | string | - | - |
| icon | Icon of the suggestion item | VNode | - | - |
| label | Display content of the suggestion item | VNode | string | - | - |
| value | Value of the suggestion item | string | - | - |

## Design Token

This component has no custom Component Token. Customize it through global Design Tokens.

## Contributors

<doc-contributors component-name="suggestion" :max-count="50" :show-view-all="true" />
