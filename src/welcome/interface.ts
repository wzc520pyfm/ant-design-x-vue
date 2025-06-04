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
  icon?: VNode | string | (() => VNode | string);
  title?: VNode | string | (() => VNode | string);
  description?: VNode | string | (() => VNode | string);
  extra?: VNode | string | (() => VNode | string);
}
