# Sender 输入框

用于聊天的输入框组件。

## 何时使用

需要构建一个对话场景下的输入框。

## 代码演示

### 智能体输入

<ClientOnly>

:::demo-v2 多功能智能体输入框，支持附件上传、深度思考开关、智能体切换和文件插入。

sender/agent

:::

</ClientOnly>

### 基本用法

<ClientOnly>

:::demo-v2 基础用法，受控进行状态管理。

sender/basic

:::

</ClientOnly>

### 开关组件

<ClientOnly>

:::demo-v2 `Sender.Switch` 是一个切换组件，常用于控制 AI 功能的开关。

sender/switch

:::

</ClientOnly>

### 词槽填空

<ClientOnly>

:::demo-v2 通过 `slotConfig` 实现词槽填空模式，支持文本、输入框、下拉选择、标签和自定义组件。

sender/slot-filling

:::

</ClientOnly>

### 实例方法

<ClientOnly>

:::demo-v2 通过 ref 调用实例方法，支持插入文本、获取焦点、取消焦点等操作。

sender/ref-action

:::

</ClientOnly>

### 提交方式

<ClientOnly>

:::demo-v2 通过 `submitType` 设置提交方式为 Shift + Enter。

sender/submitType

:::

</ClientOnly>

### 语音输入

<ClientOnly>

:::demo-v2 通过 `allowSpeech` 开启语音输入功能。

sender/speech

:::

</ClientOnly>

### 自定义语音输入

<ClientOnly>

:::demo-v2 自定义语音输入的录制状态和回调。

sender/speech-custom

:::

</ClientOnly>

### 自定义后缀按钮

<ClientOnly>

:::demo-v2 通过 `suffix` 属性，可以自定义操作按钮区域。

sender/suffix

:::

</ClientOnly>

### 展开面板

<ClientOnly>

:::demo-v2 使用 `header` 与 `Sender.Header` 配合实现面板展开。

sender/header

:::

</ClientOnly>

### 快捷指令

<ClientOnly>

:::demo-v2 配合 `Suggestion` 组件实现 @-mention 快捷指令功能。

sender/slot-with-suggestion

:::

</ClientOnly>

### 引用

<ClientOnly>

:::demo-v2 使用 `Sender.Header` 实现固定引用面板，配合 Switch 控制显示。

sender/header-fixed

:::

</ClientOnly>

### 自定义底部内容

<ClientOnly>

:::demo-v2 使用 `footer` 自定义底部内容，配合 `suffix={false}` 移除默认操作按钮。

sender/footer

:::

</ClientOnly>

### 调整发送按钮样式

<ClientOnly>

:::demo-v2 通过 `suffix` 属性，调整发送按钮的样式。

sender/send-style

:::

</ClientOnly>

### 黏贴文件

<ClientOnly>

:::demo-v2 通过 `onPasteFile` 处理黏贴文件，配合 `Attachments` 组件实现文件上传。

sender/paste-image

:::

</ClientOnly>

## API

### SenderProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowSpeech | 是否允许语音输入 | boolean \| SpeechConfig | false | - |
| autoSize | 自适应内容高度 | boolean \| \{ minRows?: number; maxRows?: number \} | \{ maxRows: 8 \} | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| components | 自定义组件 | Record\<'input', ComponentType\> | - | - |
| defaultValue | 输入框默认值 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| footer | 底部内容 | VNode \| (oriNode, info: \{ components \}) => VNode \| false | - | - |
| header | 头部面板 | VNode \| (oriNode, info: \{ components \}) => VNode \| false | - | - |
| loading | 是否加载中 | boolean | false | - |
| prefix | 前缀内容 | VNode \| (oriNode, info: \{ components \}) => VNode \| false | - | - |
| readOnly | 是否让输入框只读 | boolean | false | - |
| rootClassName | 根元素样式类 | string | - | - |
| slotConfig | 词槽配置，开启词槽填空模式 | SlotConfigType[] | - | 2.0 |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| submitType | 提交模式 | `enter` \| `shiftEnter` \| false | `enter` | - |
| suffix | 后缀操作按钮区域 | VNode \| (oriNode, info: \{ components \}) => VNode \| false | - | 2.0 |
| value(v-model) | 输入框值 | string | - | - |
| onChange | 输入框值改变的回调 | (value: string, event?: Event, slotConfig?: SlotConfigType[]) => void | - | - |
| onCancel | 点击取消按钮的回调 | () => void | - | - |
| onPasteFile | 黏贴文件的回调 | (files: FileList) => void | - | - |
| onSubmit | 点击发送按钮的回调 | (message: string, slotConfig?: SlotConfigType[]) => void | - | - |

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

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| header | 头部面板 | - |
| prefix | 前缀内容 | - |
| suffix | 后缀操作按钮区域 | \{ ori: VNode; info: \{ components: ActionsComponents \} \} |
| footer | 底部内容 | \{ ori: VNode; info: \{ components: ActionsComponents \} \} |

#### Sender Ref

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 外层容器 | `HTMLDivElement` | - | - |
| inputElement | 内部输入元素 | `HTMLTextAreaElement \| HTMLDivElement` | - | 2.0 |
| focus | 获取焦点 | (option?) => void | - | - |
| blur | 取消焦点 | () => void | - | - |
| insert | 插入内容 | (value, position?) => void | - | 2.0 |
| clear | 清空内容 | () => void | - | 2.0 |
| getValue | 获取当前值 | () => \{ value: string; config: SlotConfigType[] \} | - | 2.0 |

### Sender.Header

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 | VNode | - | - |
| closable | 是否可关闭 | boolean | true | - |
| forceRender | 强制渲染 | boolean | false | - |
| open | 是否展开 | boolean | - | - |
| title | 标题 | VNode \| string | - | - |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | - | - |

### Sender.Switch

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checkedChildren | 选中时显示的内容 | VNode | - | 2.0 |
| classNames | 样式类名 | Record\<'root' \| 'content' \| 'icon' \| 'title', string\> | - | 2.0 |
| defaultValue | 默认选中状态 | boolean | - | 2.0 |
| disabled | 是否禁用 | boolean | false | 2.0 |
| icon | 图标 | VNode | - | 2.0 |
| loading | 是否加载中 | boolean | false | 2.0 |
| onChange | 切换回调 | (checked: boolean) => void | - | 2.0 |
| styles | 语义化定义样式 | Record\<'root' \| 'content' \| 'icon' \| 'title', CSSProperties\> | - | 2.0 |
| unCheckedChildren | 未选中时显示的内容 | VNode | - | 2.0 |
| value | 选中状态 | boolean | - | 2.0 |

## Semantic DOM

<vp-semantic component="Sender"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Sender"></ComponentTokenTable> -->
