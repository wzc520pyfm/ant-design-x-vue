import type { CSSProperties } from 'vue';
import type { ItemType, SemanticType } from './interface';

/**
 * Props actually declared on `Actions.vue`.
 * `dropdownProps` stays a plain object so the SFC export does not inline
 * ant-design-vue's vue-types validators. The public `ActionsProps` type
 * still documents `Partial<DropdownProps>`.
 */
export interface ActionsRuntimeProps {
  items?: ItemType[];
  variant?: 'borderless' | 'filled' | 'outlined';
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  fadeIn?: boolean;
  fadeInLeft?: boolean;
  block?: boolean;
  dropdownProps?: Record<string, any>;
  onClick?: (menuInfo: {
    item: any;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }) => void;
}
