import type { CSSProperties, VNode } from "vue";

export type SemanticType = 'title' | 'description' | 'icon' | 'extra';

export interface WelcomeProps {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
  variant?: 'filled' | 'borderless';

  // Semantic
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;

  // Layout
  icon?: VNode | string;
  title?: VNode | string;
  description?: VNode | string;
  extra?: VNode;
}
