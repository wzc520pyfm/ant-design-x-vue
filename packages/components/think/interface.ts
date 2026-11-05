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
}
