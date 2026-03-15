import type { CSSProperties, VNode } from 'vue';
import type { VueNode } from '../_util/type';

export type LatexOption = {
  katexOptions?: Record<string, any>;
  replaceAlignStart?: boolean;
};

type HighlightCodeType = 'root' | 'header' | 'headerTitle' | 'code';
export type HighlightCodeProps = {
  lang?: string;
  children: string;
  header?: VueNode | null;
  prefixCls?: string;
  style?: CSSProperties;
  className?: string;
  highlightProps?: Record<string, any>;
  classNames?: Partial<Record<HighlightCodeType, string>>;
  styles?: Partial<Record<HighlightCodeType, CSSProperties>>;
};

type MermaidType = 'root' | 'header' | 'graph' | 'code';
export type MermaidProps = {
  children: string;
  header?: VueNode | null;
  prefixCls?: string;
  style?: CSSProperties;
  className?: string;
  highlightProps?: Record<string, any>;
  classNames?: Partial<Record<MermaidType, string>>;
  styles?: Partial<Record<MermaidType, CSSProperties>>;
};

interface BaseComponentConfig {
  style: CSSProperties;
  styles: Record<string, CSSProperties>;
  className: string;
  classNames: Record<string, string>;
}

type ComponentConfig<
  CompProps extends Record<PropertyKey, any>,
  PickType extends keyof CompProps = keyof BaseComponentConfig,
> = Pick<CompProps, PickType>;

export interface MarkdownComponentsConfig {
  highlightCode?: ComponentConfig<HighlightCodeProps>;
  mermaid?: ComponentConfig<MermaidProps>;
}

export type PluginsType = {
  Latex: (options?: LatexOption) => any[];
  HighlightCode: (props: HighlightCodeProps) => VNode;
  Mermaid: (props: MermaidProps) => VNode;
};
