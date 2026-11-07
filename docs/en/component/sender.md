# Sender

Input box component for chatting.

## When to use

Need to build an input box for a dialogue scenario.

## Examples

### Agent input

<ClientOnly>

:::demo-v2 A multi-purpose agent input with attachments, deep-thinking toggle, agent switching, and file insert.

sender/agent

:::

</ClientOnly>

### Basic usage

<ClientOnly>

:::demo-v2 Basic controlled usage.

sender/basic

:::

</ClientOnly>

### Switch

<ClientOnly>

:::demo-v2 `Sender.Switch` is a toggle component, commonly used to control AI functionality switches.

sender/switch

:::

</ClientOnly>

### Slot filling

<ClientOnly>

:::demo-v2 implements slot-fill mode through `slotConfig`, supporting text, input box, dropdown selection, tags, and custom components.

sender/slot-filling

:::

</ClientOnly>

### Instance methods

<ClientOnly>

:::demo-v2 Call instance methods via ref: insert text, focus, blur, and more.

sender/ref-action

:::

</ClientOnly>

### Submit behavior

<ClientOnly>

:::demo-v2 sets the submission method to Shift + Enter through `submitType`.

sender/submitType

:::

</ClientOnly>

### Voice input

<ClientOnly>

:::demo-v2 enables voice input functionality through `allowSpeech`.

sender/speech

:::

</ClientOnly>

### Custom voice input

<ClientOnly>

:::demo-v2 Customize voice-recording state and callbacks.

sender/speech-custom

:::

</ClientOnly>

### Custom suffix actions

<ClientOnly>

:::demo-v2 allows customization of the action button area through the `suffix` property.

sender/suffix

:::

</ClientOnly>

### Expandable panel

<ClientOnly>

:::demo-v2 uses `header` together with `Sender.Header` to achieve panel expansion.

sender/header

:::

</ClientOnly>

### Slash commands

<ClientOnly>

:::demo-v2 works with the `Suggestion` component to implement @-mention shortcut commands.

sender/slot-with-suggestion

:::

</ClientOnly>

### Quote

<ClientOnly>

:::demo-v2 uses `Sender.Header` to implement a fixed reference panel, controlled by a Switch for display.

sender/header-fixed

:::

</ClientOnly>

### Custom footer

<ClientOnly>

:::demo-v2 customizes the footer content via `footer`, and removes the default action buttons with `suffix={false}`.

sender/footer

:::

</ClientOnly>

### Customize the send button

<ClientOnly>

:::demo-v2 adjusts the send button style through the `suffix` property.

sender/send-style

:::

</ClientOnly>

### Paste files

<ClientOnly>

:::demo-v2 handles pasted files through `onPasteFile`, working with the `Attachments` component to implement file uploads.

sender/paste-image

:::

</ClientOnly>

## API

### SenderProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowSpeech | Whether to allow voice input | boolean | SpeechConfig | false | - |
| autoSize | Adaptive content height | boolean | { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| classNames | Style class names | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType\> | - | - |
| defaultValue | Default value of the input box | string | - | - |
| disabled | Whether disabled | boolean | false | - |
| footer | Footer content | VNode | (oriNode, info: { components }) => VNode | false | - | - |
| header | Header panel | VNode | (oriNode, info: { components }) => VNode | false | - | - |
| loading | Whether it is loading | boolean | false | - |
| prefix | Prefix content | VNode | (oriNode, info: { components }) => VNode | false | - | - |
| readOnly | Whether the input box is read-only | boolean | false | - |
| rootClassName | Root element style class | string | - | - |
| slotConfig | Slot configuration, enable slot fill-in-the-blank mode | SlotConfigType[] | - | 2.0 |
| styles | Semantically defined styles | [See below](#semantic-dom) | - | - |
| submitType | Submit mode | `enter` | `shiftEnter` | false | `enter` | - |
| suffix | Suffix operation button area | VNode \| (oriNode, info: { components }) => VNode \| false | - | 2.0 |
| value(v-model) | Input box value | string | - | - |
| onChange | Callback when input box value changes | (value: string, event?: Event, slotConfig?: SlotConfigType[]) => void | - | - |
| onCancel | Callback when cancel button is clicked | () => void | - | - |
| onPasteFile | Callback for pasting files | (files: FileList) => void | - | - |
| onSubmit | Callback when send button is clicked | (message: string, slotConfig?: SlotConfigType[]) => void | - | - |

```typescript | pure
type SpeechConfig = {
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
};
```

```typescript | pure
type ActionsComponents = {
  SendButton: Component;
  ClearButton: Component;
  LoadingButton: Component;
  SpeechButton: Component;
};
```

```typescript | pure
type SlotConfigType =
  | { type: 'text'; value: string; key?: string }
  | { type: 'input'; key: string; props?: { defaultValue?: string; placeholder?: string } }
  | { type: 'select'; key: string; props?: { defaultValue?: string; options: string[]; placeholder?: string } }
  | { type: 'tag'; key: string; props?: { label: VNode; value?: string } }
  | { type: 'custom'; key: string; props?: Record<string, any>; customRender?: Function; formatResult?: Function };
```

### Sender Slots

| Slot | Description | Type |
| --- | --- | --- |
| header | Header panel | - |
| prefix | Prefix content | - |
| suffix | Suffix operation button area | { ori: VNode; info: { components: ActionsComponents } } |
| footer | Footer content | { ori: VNode; info: { components: ActionsComponents } } |

#### Sender Ref

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| nativeElement | Outer container | `HTMLDivElement` | - | - |
| inputElement | Inner input element | `HTMLTextAreaElement \| HTMLDivElement` | - | 2.0 |
| focus | Get focus | (option?) => void | - | - |
| blur | Lose focus | () => void | - | - |
| insert | Insert content | (value, position?) => void | - | 2.0 |
| clear | Clear content | () => void | - | 2.0 |
| getValue | Get current value | () => { value: string; config: SlotConfigType[] } | - | 2.0 |

### Sender.Header

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Panel content | VNode | - | - |
| closable | Whether it can be closed | boolean | true | - |
| forceRender | Force render | boolean | false | - |
| open | Whether it is expanded | boolean | - | - |
| title | Title | VNode | string | - | - |
| onOpenChange | Callback for expansion state change | (open: boolean) => void | - | - |

### Sender.Switch

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkedChildren | Content displayed when checked | VNode | - | 2.0 |
| classNames | Style class names | Record<'root' | 'content' | 'icon' | 'title', string\> | - | 2.0 |
| defaultValue | Default selected state | boolean | - | 2.0 |
| disabled | Whether disabled | boolean | false | 2.0 |
| icon | Icon | VNode | - | 2.0 |
| loading | Loading state | boolean | false | 2.0 |
| onChange | Toggle callback | (checked: boolean) => void | - | 2.0 |
| styles | Semantically defined styles | Record<'root' | 'content' | 'icon' | 'title', CSSProperties\> | - | 2.0 |
| unCheckedChildren | Content displayed when unselected | VNode | - | 2.0 |
| value | Selected state | boolean | - | 2.0 |

## Semantic DOM

<vp-semantic component="Sender"></vp-semantic>

## Design Token

| Token | Description | Type | Default |
| --- | --- | --- | --- |
| colorBgSlot | Slot background color | string | `rgba(colorPrimary, 0.06)` |
| colorTextSlot | Slot text color | string | `colorPrimary` |
| colorTextSlotPlaceholder | Slot text placeholder color | string | `rgba(colorPrimary, 0.25)` |
| colorBorderSlot | Slot border color | string | `rgba(colorPrimary, 0.06)` |
| colorBorderSlotHover | Slot border hover color | string | `rgba(colorPrimary, 0.1)` |
| switchCheckedBg | Switch checked background color | string | `rgba(colorPrimary, 0.08)` |
| switchCheckedHoverBg | Switch checked hover background color | string | `rgba(colorPrimary, 0.1)` |
| switchUncheckedHoverBg | Switch unchecked hover background color | string | `rgba(colorFillTertiary, 0.04)` |
| colorBorderInput | Input box border color | string | `rgba(colorFillTertiary, 0.1)` |
| colorBgSkill | Skill background color | string | `rgba(colorPrimary, 0.08)` |
| colorBgSkillHover | Skill hover background color | string | `rgba(colorPrimary, 0.15)` |

> `colorBgActionsDisabled` / `colorTextActionsDisabled` in React documentation have not yet been exposed in Vue `Sender` ComponentToken, so they are not included.

