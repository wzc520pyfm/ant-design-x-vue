
# Sender 输入框

用于聊天的输入框组件。

## 何时使用

需要构建一个对话场景下的输入框

## 代码演示

### 基本用法

:::demo 基础用法，受控进行状态管理。自定义触发器。

sender/basic

:::

### 提交用法

:::demo 通过 `submitType` 控制换行与提交模式。

sender/submitType

:::

### 语音输入

:::demo 语音输入，需要用户同意麦克风权限。

sender/speech

:::

### 自定义语音输入

:::demo 自定义语音逻辑，从而实现调用三方库的语音识别功能。

sender/speechCustom

:::

### 自定义按钮

:::demo 通过 `actions` 属性，可以自定义发送按钮的行为。

sender/actions

:::

### 展开面板

:::demo 使用 `header` 自定义文件上传示例。

sender/header

:::

### 引用

:::demo 使用 `header` 做引用效果。

sender/headerFixed

:::

### 调整样式

:::demo 通过 `actions` 属性，调整默认样式。

sender/sendStyle

:::

### 黏贴图片

:::demo 配合 Attachments 进行黏贴文件上传。

sender/pasteImage

:::

### 聚焦

:::demo 使用 `ref` 选项控制聚焦。

sender/focus

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### SenderProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 自定义按钮 | VNode \| (oriNode, info: { components }) => VNode | - | - |
| allowSpeech | 是否允许语音输入 | boolean \| SpeechConfig | false | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| components | 自定义组件 | Record<'input', ComponentType> | - | - |
| defaultValue | 输入框默认值 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 是否加载中 | boolean | false | - |
| header | 头部面板 | VNode | - | - |
| prefix | 前缀内容 | VNode | - | - |
| readOnly | 是否让输入框只读 | boolean | false | - |
| rootClassName | 根元素样式类 | string | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| submitType | 提交模式 | SubmitType | `enter` \| `shiftEnter` | - |
| value | 输入框值 | string | - | - |
| onSubmit | 点击发送按钮的回调 | (message: string) => void | - | - |
| onChange | 输入框值改变的回调 | (value: string, event?: FormEvent \| ChangeEvent ) => void | - | - |
| onCancel | 点击取消按钮的回调 | () => void | - | - |

```typescript | pure
type SpeechConfig = {
  // 当设置 `recording` 时，内置的语音输入功能将会被禁用。
  // 交由开发者实现三方语音输入的功能。
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
};
```

### Sender Slots

| 插槽名 | 说明 |
| --- | --- |
| header | 头部面板 |
| prefix | 前缀内容 |

#### Sender Ref

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 外层容器 | `HTMLDivElement` | - | - |
| focus | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | - | - |
| blur | 取消焦点 | () => void | - | - |

### Sender.Header

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 | VNode | - | - |
| closable | 是否可关闭 | boolean | true | - |
| forceRender | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean | false | - |
| open | 是否展开 | boolean | - | - |
| title | 标题 | VNode | - | - |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | - | - |

## Semantic DOM

<vp-semantic component="Sender"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Sender"></ComponentTokenTable> -->
