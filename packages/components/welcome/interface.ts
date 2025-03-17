import type { CSSProperties, VNode } from "vue";
import type { AvoidValidation } from '../type-utility'

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
  icon?: AvoidValidation<VNode | string | (() => VNode | string)>;
  title?: AvoidValidation<VNode | string | (() => VNode | string)>;
  description?: AvoidValidation<VNode | string | (() => VNode | string)>;
  extra?: AvoidValidation<VNode | string | (() => VNode | string)>;
}
