import type { CSSProperties, VNode } from 'vue';

export type ThinkSemanticType = 'root' | 'status' | 'content';

export interface ThinkProps {
  prefixCls?: string;
  style?: CSSProperties;
  styles?: Partial<Record<ThinkSemanticType, CSSProperties>>;
  class?: string;
  classNames?: Partial<Record<ThinkSemanticType, string>>;
  rootClassName?: string;
  title?: VNode | string;
  icon?: VNode;
  loading?: boolean | VNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (expand: boolean) => void;
  blink?: boolean;
  /**
   * @desc 隐藏时是否销毁内容节点
   * @descEN Whether to destroy content node when hidden
   * @default true
   */
  destroyOnHidden?: boolean;
}
