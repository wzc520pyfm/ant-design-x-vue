# Sender 输入框

用于聊天的输入框组件。

## 何时使用

需要构建一个对话场景下的输入框

## 代码演示

### 基本用法

<ClientOnly>

:::demo 基础用法，受控进行状态管理。自定义触发器。

sender/basic

:::

</ClientOnly>

### 提交用法

<ClientOnly>

:::demo 通过 `submitType` 控制换行与提交模式。

sender/submitType

:::

</ClientOnly>

### 语音输入

<ClientOnly>

:::demo 语音输入，需要用户同意麦克风权限。

sender/speech

:::

</ClientOnly>

### 语音输入图标

<ClientOnly>

:::demo 调整语音输入显示的图标，包含正在录音的图标。

sender/speechIcon

:::

</ClientOnly>

### 自定义语音输入

<ClientOnly>

:::demo 自定义语音逻辑，从而实现调用三方库的语音识别功能。

sender/speechCustom

:::

</ClientOnly>

### 自定义按钮

<ClientOnly>

:::demo 通过 `actions` 属性，可以自定义发送按钮的行为。

sender/actions

:::

</ClientOnly>

### 展开面板

<ClientOnly>

:::demo 使用 `header` 自定义文件上传示例。

sender/header

:::

</ClientOnly>

### 引用

<ClientOnly>

:::demo 使用 `header` 做引用效果。

sender/headerFixed

:::

</ClientOnly>

### 自定义底部内容

:::demo 使用 `footer` 自定义底部内容。

sender/footer

:::

### 自定义输入框

:::demo 使用 `components.input` 自定义输入框。

sender/custom-input

:::

### 调整样式

<ClientOnly>

:::demo 通过 `actions` 属性，调整默认样式。

sender/sendStyle

:::

</ClientOnly>

### 黏贴文件

<ClientOnly>

:::demo 使用 `onPasteFile` 获取黏贴的文件，配合 Attachments 进行文件上传。

sender/pasteImage

:::

</ClientOnly>

### 聚焦

<ClientOnly>

:::demo 使用 `ref` 选项控制聚焦。

sender/focus

:::

</ClientOnly>

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### SenderProps

| 属性           | 说明                                                                        | 类型                                                                   | 默认值                  | 版本 |
| -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------- | ---- |
| actions        | 自定义按钮，当不需要默认操作按钮时，可以设为 `actions={false}`              | VNode \| (oriNode, info: \{ components: ActionsComponents \}) => VNode | -                       | -    |
| allowSpeech    | 是否允许语音输入                                                            | boolean \| SpeechConfig                                                | false                   | -    |
| classNames     | 样式类名                                                                    | [见下](#semantic-dom)                                                  | -                       | -    |
| components     | 自定义组件，input默认为[Input.TextArea](https://www.antdv.com/components/input-cn#api)，确保在自定义输入组件时，按照 `Input.TextArea` 实现所有必要的 props，以避免功能不全。| Record<'input', ComponentType> | -   | -    |
| defaultValue   | 输入框默认值                                                                | string                                                                 | -                       | -    |
| disabled       | 是否禁用                                                                    | boolean                                                                | false                   | -    |
| loading        | 是否加载中                                                                  | boolean                                                                | false                   | -    |
| header         | 头部面板                                                                    | VNode \| () => VNode                                                   | -                       | -    |
| prefix         | 前缀内容                                                                    | VNode \| () => VNode                                                   | -                       | -    |
| footer         | 底部内容                                                                    | ReactNode \| (info: \{ components: ActionsComponents \}) => ReactNode  | -                       | -    |
| readOnly       | 是否让输入框只读                                                            | boolean                                                                | false                   | -    |
| rootClassName  | 根元素样式类                                                                | string                                                                 | -                       | -    |
| styles         | 语义化定义样式                                                              | [见下](#semantic-dom)                                                  | -                       | -    |
| submitType     | 提交模式                                                                    | SubmitType                                                             | `enter` \| `shiftEnter` | -    |
| value(v-model) | 输入框值                                                                    | string                                                                 | -                       | -    |
| onSubmit       | 点击发送按钮的回调                                                          | (message: string) => void                                              | -                       | -    |
| onChange       | 输入框值改变的回调                                                          | (value: string, event?: FormEvent \| ChangeEvent ) => void             | -                       | -    |
| onCancel       | 点击取消按钮的回调                                                          | () => void                                                             | -                       | -    |
| onPasteFile    | 黏贴文件的回调                                                              | (firstFile: File, files: FileList) => void                             | -                       | -    |
| autoSize       | 自适应内容高度，可设置为 true \| false 或对象：\{ minRows: 2, maxRows: 6 \} | boolean \| \{ minRows?: number; maxRows?: number \}                    | \{ maxRows: 8 \}        | -    |

```typescript | pure
type SpeechConfig = {
  // 当设置 `recording` 时，内置的语音输入功能将会被禁用。
  // 交由开发者实现三方语音输入的功能。
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
  audioIcon?: ButtonProps['icon'] | VNode;
  audioDisabledIcon?: ButtonProps['icon'] | VNode;
  audioRecordingIcon?: ButtonProps['icon'] | VNode;
};
```

```typescript | pure
type ActionsComponents = {
  SendButton: InstanceType<ButtonProps>;
  ClearButton: InstanceType<ButtonProps>;
  LoadingButton: InstanceType<ButtonProps>;
  SpeechButton: InstanceType<ButtonProps>;
};
```

### Sender Slots

| 插槽名  | 说明     | 类型                                                                                                                                                                                                  |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| header  | 头部面板 | -                                                                                                                                                                                                     |
| prefix  | 前缀内容 | _                                                                                                                                                                                                     |
| actions | 操作按钮 | \{ ori: VNode; info: \{ components: \{ SendButton: InstanceType\<Button\>; ClearButton: InstanceType\<Button\>; LoadingButton: InstanceType\<Button\>; SpeechButton: InstanceType\<Button\>; \} \} \} |
| footer  | 底部内容 | \{ info: \{ components: \{ SendButton: InstanceType\<Button\>; ClearButton: InstanceType\<Button\>; LoadingButton: InstanceType\<Button\>; SpeechButton: InstanceType\<Button\>; \} \} \}             |

#### Sender Ref

| 属性          | 说明     | 类型                                                                       | 默认值 | 版本 |
| ------------- | -------- | -------------------------------------------------------------------------- | ------ | ---- |
| nativeElement | 外层容器 | `HTMLDivElement`                                                           | -      | -    |
| focus         | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | -      | -    |
| blur          | 取消焦点 | () => void                                                                 | -      | -    |

### Sender.Header

| 属性         | 说明                                        | 类型                    | 默认值 | 版本 |
| ------------ | ------------------------------------------- | ----------------------- | ------ | ---- |
| children     | 面板内容                                    | VNode                   | -      | -    |
| closable     | 是否可关闭                                  | boolean                 | true   | -    |
| forceRender  | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean                 | false  | -    |
| open         | 是否展开                                    | boolean                 | -      | -    |
| title        | 标题                                        | VNode                   | -      | -    |
| onOpenChange | 展开状态改变的回调                          | (open: boolean) => void | -      | -    |

## Semantic DOM

<vp-semantic component="Sender"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Sender"></ComponentTokenTable> -->

## 贡献者

<doc-contributors component-name="sender" :max-count="50" :show-view-all="true" />
