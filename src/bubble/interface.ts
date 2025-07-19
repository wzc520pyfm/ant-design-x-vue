import type { AvatarProps } from 'ant-design-vue';
import type { AvoidValidation } from '../type-utility';
import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import { AnyObject } from '../_util/type';

export interface TypingOption {
  /**
   * @default 1
   */
  step?: number;
  /**
   * @default 50
   */
  interval?: number;
  /**
   * @default null
   */
  suffix?: VNode | string;
}

export type SemanticType = 'avatar' | 'content' | 'header' | 'footer';

export type BubbleContentType = VNode | string | AnyObject | number;

export type SlotInfoType = {
  key?: string | number;
};

export interface _AvatarProps extends AvatarProps {
  class: string;
  style: CSSProperties;
}

export interface BubbleProps<ContentType extends BubbleContentType = string> extends /* @vue-ignore */ Omit<HTMLAttributes, 'content'> {
  prefixCls?: string;
  rootClassName?: string;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  avatar?: Partial<_AvatarProps> | VNode | (() => VNode);
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: AvoidValidation<TypingOption | boolean>;
  content?: ContentType;
  messageRender?: (content: ContentType) => VNode | string;
  loadingRender?: () => VNode;
  variant?: 'filled' | 'borderless' | 'outlined' | 'shadow';
  shape?: 'round' | 'corner';
  _key?: number | string;
  onTypingComplete?: VoidFunction;
  header?: AvoidValidation<VNode | string | ((content: ContentType, info: SlotInfoType) => VNode | string)>;
  footer?: AvoidValidation<VNode | string | ((content: ContentType, info: SlotInfoType) => VNode | string)>;
}

export interface BubbleRef {
  nativeElement: HTMLElement;
}

export interface BubbleContextProps {
  onUpdate?: VoidFunction;
}

export interface BubbleListRef {
  nativeElement: HTMLDivElement;
  scrollTo: (info: {
    offset?: number;
    key?: string | number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => void;
}

export type BubbleDataType = BubbleProps<any> & {
  key?: string | number;
  role?: string;
};

export type RoleType = Partial<Omit<BubbleProps<any>, 'content'>>;

export type RolesType = Record<string, RoleType> | ((bubbleDataP: BubbleDataType, index: number) => RoleType);

export interface BubbleListProps extends /* @vue-ignore */ HTMLAttributes {
  prefixCls?: string;
  rootClassName?: string;
  items?: BubbleDataType[];
  autoScroll?: boolean;
  roles?: AvoidValidation<RolesType>;
}
