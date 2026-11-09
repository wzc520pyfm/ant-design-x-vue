import type { CSSProperties, VNode } from 'vue';

export type MermaidSemanticType = 'root' | 'header' | 'graph' | 'code';

export interface MermaidProps {
  children?: string;
  header?: VNode | null;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<MermaidSemanticType, string>>;
  styles?: Partial<Record<MermaidSemanticType, CSSProperties>>;
}
