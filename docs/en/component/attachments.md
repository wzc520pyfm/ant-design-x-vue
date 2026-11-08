
# Attachments

Used to display a collection of attachment information.

## When to use

The Attachments component is used in scenarios where there is a need to display a set of attachment information.

## Examples

### Basic

<ClientOnly>

:::demo-v2 Basic usage, drag-and-drop upload is supported through `getDropContainer`.

attachments/basic

:::

</ClientOnly>

### Placeholder

:::demo-v2 Customize the placeholder.

attachments/placeholder

:::

### Overflow style

:::demo-v2 Control how attachments overflow.

attachments/overflow

:::

### Combined example

<ClientOnly>

:::demo-v2 Insert attachments in a conversation with Sender.Header.

attachments/with-sender

:::

</ClientOnly>

### Select files by type

<ClientOnly>

:::demo-v2 Open the file selector by type via ref's `select`.

attachments/select-files

:::

</ClientOnly>

### File card

<ClientOnly>

:::demo-v2 A standalone file card for display-only scenes.

attachments/files

:::

</ClientOnly>

### Custom card icon

<ClientOnly>

:::demo-v2 Customize the file-card icon, color, and file range.

attachments/files-custom

:::

</ClientOnly>

## API

General properties reference: [General Properties](/en/development/common-props).

### Attachments Props

Inherits antdv [Upload](https://www.antdv.com/components/upload-cn) properties.

| Prop | Description | Type | Default | Version |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ | ---- |
| classNames       | Custom style class names, [see below](#semantic-dom)                         | Record\<string, string\>                                           | -      | - |
| disabled         | Whether disabled                                                                   | boolean                                                            | false  | -    |
| getDropContainer | Set the area where the file can be released when dragging | () => HTMLElement | - | - |
| items | attachment list, same as Upload `fileList` | Attachment[] | - | - |
| overflow | Style when the file list exceeds | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | Placeholder information when there is no file | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName    | Root class name                                                           | string                                                             | -      | -    |
| rootStyle        | Root style object                                                           | CSSProperties                                                      | -      | -    |
| styles | Custom style object, [see below](#semantic-dom) | Record\<string, CSSProperties\> | - | - |
| imageProps | Image properties, same as antdv [Image](https://www.antdv.com/components/image-cn) properties | ImageProps | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: VNode;
  title?: VNode | string;
  description?: VNode | string;
}
```

### Attachments Slots

| Slot | Description | Type |
| ----------- | -------------------- | ------------------------------ |
| placeholder | Placeholder information when there is no file | \{ type: "inline" \| "drop" \} |

### Attachments Expose

| Prop | Description | Type | Version |
| ----------------- | ---------------------------- | ------------------------------------------------------------ | ---- |
| nativeElement | Get native node | HTMLElement | - |
| fileNativeElement | Get the native input node for file upload | HTMLInputElement \| null | - |
| upload | Manually call to upload files | (file: File \| File[] \| FileList) => void | - |
| select | Manually open the file selector (can override accept / multiple) | (options: \{ accept?: string; multiple?: boolean \}) => void | - |

### Attachments.FileCard Props

| Prop | Description | Type | Default | Version |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ------ | ---- |
| item | Attachment, same as Upload `UploadFile` | Attachment | - | - |
| onRemove | Callback when clicking to remove a file. If the return value is false, the file will not be removed. It also supports returning a Promise object; if the Promise resolves with false or rejects, the file will not be removed | (item: Attachment) => boolean | Promise | - | - |
| icon | Custom icon | VNode | PresetIcons | - | - |
| type | Defines the file type. When the type is `image`, it will display in image preview mode | 'file' | 'image' | `file` | - |

```ts
type PresetIcons = 'default' | 'excel' | 'image' | 'markdown' | 'pdf' | 'ppt' | 'word' | 'zip' | 'video' | 'audio';
```

## Semantic DOM

<vp-semantic component="Attachments"></vp-semantic>

> The semantic keys for Vue `Attachments` `classNames` / `styles` are `list` / `item` / `placeholder` / `upload` (different from some FileCard semantics in React 2.10, here only records the keys actually exposed by Vue).

## Design Token

| Token | Description | Type | Default |
| --- | --- | --- | --- |
| colorBgPlaceholderHover | Background color on placeholder hover | string | `rgba(colorBgContainer, 0.85)` |

## Contributors

<doc-contributors component-name="attachments" :max-count="50" :show-view-all="true" />
