# FileCard

Display files in the form of cards.

## When to use

- Used to display files during conversation or input.

## Examples

### Basic usage

::::demo-v2 Different file types pick matching icons and colors.

file-card/basic

::::

### Card size

::::demo-v2 Set the card size through the `size` property.

file-card/size

::::

### Image files

::::demo-v2 Image type files will automatically show image previews. You can force display as a file card using `type="file"`.

file-card/image

::::

### Image loading

::::demo-v2 Show a loading animation while images load.

file-card/image-loading

::::

### Audio and video

::::demo-v2 Audio and video type files support inline playback, and can also be displayed as file cards using `type="file"`.

file-card/audio

::::

### Overlay mask

::::demo-v2 Add overlay content through the `mask` property.

file-card/mask

::::

### Custom icon

::::demo-v2 Customize icons through the `icon` property, supporting preset icon names or custom VNode.

file-card/icon

::::

### File list

::::demo-v2 Display file lists using `FileCard.List`, supporting deletion and image preview.

file-card/list

::::

### Overflow style

::::demo-v2 Control the display style when the list overflows through the `overflow` property.

file-card/overflow

::::

## API

### FileCardProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | File Name | string | - | - |
| byte | File size (bytes) | number | - | - |
| size | Card Size | `'small'` \| `'default'` | `'default'` | - |
| description | Document Description | VNode \| string | - | - |
| loading | Is it in loaded mode | boolean | false | - |
| type | File Type | `'file'` \| `'image'` \| `'audio'` \| `'video'` \| string | - | - |
| src | Image or File Address | string | - | - |
| mask | Mask Content | VNode \| string | - | - |
| icon | Custom icon | VNode | PresetIcons | - | - |
| imageProps | Image properties, same as ant-design-vue [Image](https://www.antdv.com/components/image-cn#api) properties | ImageProps | - | - |
| videoProps | Video Attribute Configuration | Record\<string, any\> | - | - |
| audioProps | Audio Attribute Configuration | Record\<string, any\> | - | - |
| spinProps | Loading Properties | [SpinProps] (https://www.antdv.com/components/spin-cn#api) & \{ showText?: boolean; icon?: VNode \} | - | - |
| onClick | Click event callback | () => void | - | - |

### PresetIcons

Preset icon types, supporting the following values:

```typescript
type PresetIcons =
  | 'default'    // 默认文件图标
  | 'excel'      // Excel 文件图标
  | 'image'      // 图片文件图标
  | 'markdown'   // Markdown 文件图标
  | 'pdf'        // PDF 文件图标
  | 'ppt'        // PowerPoint 文件图标
  | 'word'       // Word 文件图标
  | 'zip'        // 压缩文件图标
  | 'video'      // 视频文件图标
  | 'audio'      // 音频文件图标
  | 'java'       // Java 文件图标
  | 'javascript' // JavaScript 文件图标
  | 'python';    // Python 文件图标
```

### FileCard.List

File list component, used to display multiple file cards.

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | File list data. Each item is FileCardProps, and `key` can be used as a stable identifier; defaults to `name-index` if missing | (FileCardProps & { key?: string | number })[] | - | - |
| size | Card Size | `'small'` \| `'default'` | `'default'` | - |
| removable | Whether it can be deleted | boolean | ((item: FileCardProps) => boolean) | false | - |
| onRemove | Remove event callback | (item: FileCardProps) => void | - | - |
| extension | Extended content | VNode | - | - |
| overflow | Overflow display method | `'scrollX'` | `'scrollY'` | `'wrap'` | `'wrap'` | - |

## Semantic DOM

<vp-semantic component="FileCard"></vp-semantic>

## Design Token

This component has no custom Component Token. Customize it through global Design Tokens.
