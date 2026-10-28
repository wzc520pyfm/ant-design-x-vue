import type { CSSProperties, VNodeChild } from 'vue';

export interface ActionsItemRuntimeProps {
  status?: 'loading' | 'error' | 'running' | 'default';
  defaultIcon?: VNodeChild;
  label?: string;
  runningIcon?: VNodeChild;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
}
