# FileCard 文件卡片 <Badge type="warning" text="v2" />

用卡片的形式展示文件。

## 何时使用

- 用于在对话或输入时展示文件。

## 代码演示

### 基础用法

::::demo-v2 不同类型文件会自动匹配对应图标和颜色。

file-card/basic

::::

### 卡片大小

::::demo-v2 通过 `size` 属性设置卡片大小。

file-card/size

::::

### 图片文件

::::demo-v2 图片类型文件会自动展示图片预览。可通过 `type="file"` 强制展示为文件卡片。

file-card/image

::::

### 图片加载

::::demo-v2 图片加载时显示加载动画。

file-card/image-loading

::::

### 音视频类型

::::demo-v2 音频和视频类型文件支持内联播放，也可通过 `type="file"` 以文件卡片形式展示。

file-card/audio

::::

### 使用遮罩

::::demo-v2 通过 `mask` 属性添加遮罩内容。

file-card/mask

::::

### 自定义图标

::::demo-v2 通过 `icon` 属性自定义图标，支持传入预设图标名称或自定义 VNode。

file-card/icon

::::

### 文件列表

::::demo-v2 使用 `FileCard.List` 展示文件列表，支持删除和图片预览。

file-card/list

::::

### 超出样式

::::demo-v2 通过 `overflow` 属性控制列表超出时的展示方式。

file-card/overflow

::::

## API

### FileCardProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 文件名称 | string | - | - |
| byte | 文件大小（字节） | number | - | - |
| size | 卡片大小 | `'small'` \| `'default'` | `'default'` | - |
| description | 文件描述 | VNode \| string | - | - |
| loading | 是否处于加载状态 | boolean | false | - |
| type | 文件类型 | `'file'` \| `'image'` \| `'audio'` \| `'video'` \| string | - | - |
| src | 图片或文件地址 | string | - | - |
| mask | 遮罩内容 | VNode \| string | - | - |
| icon | 自定义图标 | VNode \| PresetIcons | - | - |
| imageProps | 图片属性，同 ant-design-vue [Image](https://www.antdv.com/components/image-cn#api) 属性 | ImageProps | - | - |
| videoProps | 视频属性配置 | Record\<string, any\> | - | - |
| audioProps | 音频属性配置 | Record\<string, any\> | - | - |
| spinProps | 加载中属性 | [SpinProps](https://www.antdv.com/components/spin-cn#api) & \{ showText?: boolean; icon?: VNode \} | - | - |
| onClick | 点击事件回调 | () => void | - | - |

### PresetIcons

预设图标类型，支持以下值：

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

文件列表组件，用于展示多个文件卡片。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 文件列表数据 | FileCardProps[] | - | - |
| size | 卡片大小 | `'small'` \| `'default'` | `'default'` | - |
| removable | 是否可删除 | boolean \| ((item: FileCardProps) => boolean) | false | - |
| onRemove | 删除事件回调 | (item: FileCardProps) => void | - | - |
| extension | 扩展内容 | VNode | - | - |
| overflow | 超出展示方式 | `'scrollX'` \| `'scrollY'` \| `'wrap'` | `'wrap'` | - |

### Semantic DOM

#### FileCard

支持通过 `classNames` 和 `styles` 自定义语义化 DOM：

| 名称 | 说明 |
| --- | --- |
| root | 根元素 |
| file | 文件容器 |
| icon | 图标 |
| name | 文件名 |
| description | 描述 |

#### FileCard.List

| 名称 | 说明 |
| --- | --- |
| root | 根元素 |
| card | 卡片容器 |
