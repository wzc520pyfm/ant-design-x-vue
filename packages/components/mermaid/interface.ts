import type { CSSProperties, VNode } from 'vue';
import type { MermaidConfig } from 'mermaid';
import type { ItemType } from '../actions/interface';
import type { AvoidValidation } from '../type-utility';

export type MermaidSemanticType = 'root' | 'header' | 'graph' | 'code';

/** @deprecated use MermaidSemanticType */
export type MermaidType = MermaidSemanticType;

export type MermaidRenderType = 'image' | 'code';

export interface MermaidActionsConfig {
  enableZoom?: boolean;
  enableDownload?: boolean;
  enableCopy?: boolean;
  customActions?: ItemType[];
}

/**
 * Extra options for the code view highlighter.
 * Wired to standalone CodeHighlighter after that lands (#526);
 * accepted now for API parity with React `@ant-design/x` 2.10.
 */
export type MermaidHighlightProps = Record<string, unknown>;

export interface MermaidProps {
  /**
   * @desc Mermaid 代码内容（与 React children 对齐；也可用默认插槽）
   * @descEN Mermaid source (aligned with React children; default slot also works)
   */
  children?: string;
  /**
   * @desc 头部内容；传 `null` / `false` 时不显示默认头部
   * @descEN Header content; `null` / `false` hides the default header
   */
  header?: AvoidValidation<false | null | VNode | string | (() => VNode | string | false | null)>;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<MermaidSemanticType, string>>;
  styles?: Partial<Record<MermaidSemanticType, CSSProperties>>;
  /**
   * @desc 透传给代码视图高亮器的配置（当前代码视图为 pre；CodeHighlighter 接入后生效）
   * @descEN Passed to the code-view highlighter (pre for now; CodeHighlighter later)
   */
  highlightProps?: MermaidHighlightProps;
  /**
   * @desc mermaid.initialize 配置；请保持引用稳定以免重复初始化
   * @descEN mermaid.initialize config; keep referentially stable to avoid re-init
   */
  config?: MermaidConfig;
  /**
   * @desc 头部操作配置
   * @descEN Header actions configuration
   */
  actions?: MermaidActionsConfig;
  /**
   * @desc 视图切换回调
   * @descEN Fired when image/code render type changes
   */
  onRenderTypeChange?: (value: MermaidRenderType) => void;
}
