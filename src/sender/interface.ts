import type { ButtonProps, TextAreaProps } from "ant-design-vue";
import { Input } from "ant-design-vue";
import type { ConfigProviderProps } from "ant-design-vue";
import type { CSSProperties, VNode } from "vue";
import type { AllowSpeech } from "./useSpeech";
import type { AvoidValidation } from '../type-utility';
import SendButton from "./components/SendButton.vue";
import ClearButton from "./components/ClearButton.vue";
import LoadingButton from "./components/LoadingButton.vue";
import SpeechButton from "./components/SpeechButton/index.vue";

export type SubmitType = 'enter' | 'shiftEnter' | false;

export type KeyboardEventHandler = (e: KeyboardEvent) => void;

export type ClipboardEventHandler = (e: ClipboardEvent) => void;

export type ChangeEvent = Event & {
  target: {
    value?: string | undefined;
  };
}

export interface SenderComponents {
  input?: typeof Input.TextArea;
}

export type ActionsComponents = {
  SendButton: typeof SendButton;
  ClearButton: typeof ClearButton;
  LoadingButton: typeof LoadingButton;
  SpeechButton: typeof SpeechButton;
}

export type ActionsRender = (
  ori: VNode,
  info: {
    components: ActionsComponents;
  },
) => VNode;

export type FooterRender = (info: { components: ActionsComponents }) => VNode;

export interface SenderProps {
  onKeyPress?: KeyboardEventHandler;
  onFocus?: TextAreaProps['onFocus'];
  onBlur?: TextAreaProps['onBlur'];

  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  placeholder?: TextAreaProps['placeholder'];
  readOnly?: boolean;
  submitType?: SubmitType;
  disabled?: boolean;
  onSubmit?: (message: string) => void;
  onChange?: (
    value: string,
    event?: ChangeEvent,
    // event?: FormEvent | ChangeEvent,
  ) => void;
  onCancel?: VoidFunction;
  onKeyDown?: KeyboardEventHandler;
  onPaste?: ClipboardEventHandler;
  onPasteFile?: (firstFile: File, files: FileList) => void;
  components?: SenderComponents;
  styles?: {
    prefix?: CSSProperties;
    input?: CSSProperties;
    actions?: CSSProperties;
    footer?: CSSProperties;
  };
  rootClassName?: string;
  classNames?: {
    prefix?: string;
    input?: string;
    actions?: string;
    footer?: string;
  };
  style?: CSSProperties;
  className?: string;
  actions?: VNode | ActionsRender | false;
  allowSpeech?: AvoidValidation<AllowSpeech>;
  prefix?: VNode | (() => VNode);
  footer?: VNode | FooterRender;
  header?: VNode | (() => VNode);
  autoSize?: AvoidValidation<boolean | { minRows?: number; maxRows?: number }>;
}

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}
export type SenderRef = {
  nativeElement: HTMLDivElement;
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
};

export interface SenderHeaderContextProps {
  prefixCls?: ConfigProviderProps['prefixCls'];
}

export type SemanticType = 'header' | 'content';

export interface SenderHeaderProps {
  forceRender?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: VNode | string;
  children?: VNode;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  closable?: boolean;
}

export interface RecordingIconProps {
  className?: string;
  audioIcon?: ButtonProps['icon'];
  audioDisabledIcon?: ButtonProps['icon'];
  audioRecordingIcon?: ButtonProps['icon'];
}

export interface ActionButtonContextProps {
  prefixCls?: ConfigProviderProps['prefixCls'];
  onSend?: VoidFunction;
  onSendDisabled?: boolean;
  onClear?: VoidFunction;
  onClearDisabled?: boolean;
  onCancel?: VoidFunction;
  onCancelDisabled?: boolean;
  onSpeech?: VoidFunction;
  onSpeechDisabled?: boolean;
  speechRecording?: boolean;
  disabled?: boolean;
}

// refer from the ButtonProps of ant-design-vue
export interface AntdButtonProps {
  prefixCls?: ButtonProps['prefixCls'];
  type?: ButtonProps['type'];
  htmlType?: ButtonProps['htmlType'];
  shape?: ButtonProps['shape'];
  size?: ButtonProps['size'];
  loading?: ButtonProps['loading'];
  disabled?: ButtonProps['disabled'];
  ghost?: ButtonProps['ghost'];
  block?: ButtonProps['block'];
  danger?: ButtonProps['danger'];
  icon?: ButtonProps['icon'];
  href?: ButtonProps['href'];
  target?: ButtonProps['target'];
  title?: ButtonProps['title'];
  onClick?: ButtonProps['onClick'];
  onMousedown?: ButtonProps['onMousedown'];
  audioIcon?: ButtonProps['icon'] | VNode;
  audioDisabledIcon?: ButtonProps['icon'] | VNode
  audioRecordingIcon?: ButtonProps['icon'] | VNode;
}

export interface ActionButtonProps extends AntdButtonProps {
  action: 'onSend' | 'onClear' | 'onCancel' | 'onSpeech';
}
