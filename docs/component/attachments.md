
# Attachments 输入附件

用于展示一组附件信息集合。

## 何时使用

Attachments 组件用于需要展示一组附件信息集合的场景。

## 代码演示

### 基本

:::demo 基础用法，可以通过 `getDropContainer` 支持拖拽上传。

attachments/basic

:::

### 占位信息

:::demo 修改占位信息。

attachments/placeholder

:::

### 超出样式

:::demo 控制附件超出区域长度时的展示方式。

attachments/overflow

:::

### 文件卡片

:::demo 单独的文件卡片，用于一些展示场景。

attachments/files

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props)。 -->

### Attachments Props

继承 antdv [Upload](https://www.antdv.com/components/upload-cn) 属性。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，[见下](#semantic-dom) | Record<string, string> | - | - |
| disabled | 是否禁用 | boolean | false | - |
| getDropContainer | 设置拖拽时，可以释放文件的区域 | () => HTMLElement | - | - |
| items | 附件列表，同 Upload `fileList` | Attachment[] | - | - |
| overflow | 文件列表超出时样式 | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | 没有文件时的占位信息 | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| rootStyle | 根节点的样式对象 | CSSProperties | - | - |
| styles | 自定义样式对象，[见下](#semantic-dom) | Record<string, CSSProperties> | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: VNode;
  title?: VNode | string;
  description?: VNode | string;
}
```

### Attachments Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| placeholder | 没有文件时的占位信息 | \{ type: "inline" \| "drop" \} |

### Attachments Expose

| 属性          | 说明             | 类型                 | 版本 |
| ------------- | ---------------- | -------------------- | ---- |
| nativeElement | 获取原生节点     | HTMLElement          | -    |
| upload        | 手工调用上传文件 | (file: File) => void | -    |

### Attachments.FileCard Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| item | 附件，同 Upload `UploadFile` | Attachment | - | - |
| onRemove | 附件移除时的回调函数 | (item: Attachment) => void | - | - |

## Semantic DOM

<vp-semantic component="Attachments"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Prompts"></ComponentTokenTable> -->
