import type { ButtonProps, InputProps, TextAreaProps } from "ant-design-vue";
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

export type insertPosition = 'start' | 'end' | 'cursor';

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

export type BaseNode = VNode | false;
export type NodeRender = (
  oriNode: VNode,
  info: {
    components: ActionsComponents;
  },
) => BaseNode;

interface SlotConfigBaseType {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom';
  formatResult?: (value: any) => string;
}

interface SlotConfigTextType extends SlotConfigBaseType {
  type: 'text';
  value: string;
  key?: string;
}

interface SlotConfigInputType extends SlotConfigBaseType {
  type: 'input';
  key: string;
  props?: {
    defaultValue?: InputProps['defaultValue'];
    placeholder?: string | undefined;
  };
}

interface SlotConfigSelectType extends SlotConfigBaseType {
  type: 'select';
  key: string;
  props?: {
    defaultValue?: string;
    options: string[];
    placeholder?: string | undefined;
  };
}

interface SlotConfigTagType extends SlotConfigBaseType {
  type: 'tag';
  key: string;
  props?: {
    label: VNode;
    value?: string;
  };
}

interface SlotConfigCustomType extends SlotConfigBaseType {
  type: 'custom';
  key: string;
  props?: {
    defaultValue?: any;
    [key: string]: any;
  };
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    props: {
      disabled?: boolean;
      readOnly?: boolean;
    },
    item: SlotConfigType,
  ) => VNode;
}

export type SlotConfigType =
  | SlotConfigTextType
  | SlotConfigInputType
  | SlotConfigSelectType
  | SlotConfigTagType
  | SlotConfigCustomType;

export type EventType = Event;

type SemanticType = 'root' | 'prefix' | 'input' | 'suffix' | 'footer' | 'switch' | 'content';

export interface SenderProps {
  onKeyUp?: KeyboardEventHandler;
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
  slotConfig?: Readonly<SlotConfigType[]>;
  onSubmit?: (message: string, slotConfig?: SlotConfigType[]) => void;
  onChange?: (
    value: string,
    event?: EventType,
    slotConfig?: SlotConfigType[],
  ) => void;
  onCancel?: VoidFunction;
  onKeyDown?: KeyboardEventHandler;
  onPaste?: ClipboardEventHandler;
  onPasteFile?: (files: FileList) => void;
  components?: SenderComponents;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  rootClassName?: string;
  style?: CSSProperties;
  className?: string;
  allowSpeech?: AvoidValidation<AllowSpeech>;
  prefix?: BaseNode | NodeRender;
  footer?: BaseNode | NodeRender;
  suffix?: BaseNode | NodeRender;
  header?: BaseNode | NodeRender;
  /** @deprecated Use `suffix` instead */
  actions?: VNode | ((oriNode: VNode, info: { components: ActionsComponents }) => VNode) | false;
  /** @deprecated */
  sendDisabled?: boolean;
  autoSize?: AvoidValidation<boolean | { minRows?: number; maxRows?: number }>;
}

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}

export type TextAreaRef = {
  nativeElement: HTMLTextAreaElement;
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  insert: (value: string, position?: insertPosition) => void;
  clear: () => void;
  getValue: () => { value: string; config: any[] };
};

export type SlotTextAreaRef = {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  nativeElement: HTMLDivElement;
  insert: (
    slotConfig: SlotConfigType[],
    position?: insertPosition,
    replaceCharacters?: string,
  ) => void;
  clear: () => void;
  getValue: () => {
    value: string;
    config: SlotConfigType[];
  };
};

export type SenderRef = Omit<TextAreaRef, 'nativeElement'> &
  Omit<SlotTextAreaRef, 'nativeElement'> & {
    inputElement: TextAreaRef['nativeElement'] | SlotTextAreaRef['nativeElement'];
    nativeElement: HTMLDivElement;
  };

export interface SenderHeaderContextProps {
  prefixCls?: ConfigProviderProps['prefixCls'];
}

export type SenderHeaderSemanticType = 'header' | 'content';

export interface SenderHeaderProps {
  forceRender?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: VNode | string;
  children?: VNode;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<SenderHeaderSemanticType, string>>;
  styles?: Partial<Record<SenderHeaderSemanticType, CSSProperties>>;
  closable?: boolean;
}

export interface RecordingIconProps {
  className?: string;
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
}

export interface ActionButtonProps extends AntdButtonProps {
  action: 'onSend' | 'onClear' | 'onCancel' | 'onSpeech';
}

export type SenderSwitchSemanticType = 'root' | 'content' | 'icon' | 'title';

export interface SenderSwitchProps {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
  checkedChildren?: VNode;
  unCheckedChildren?: VNode;
  value?: boolean;
  defaultValue?: boolean;
  icon?: VNode;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  classNames?: Partial<Record<SenderSwitchSemanticType, string>>;
  styles?: Partial<Record<SenderSwitchSemanticType, CSSProperties>>;
}
