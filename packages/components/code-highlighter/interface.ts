import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AvoidValidation } from '../type-utility';

export type CodeHighlighterSemanticType = 'root' | 'header' | 'headerTitle' | 'code';

/**
 * Extra options for the Prism-based highlighter.
 * Aligns loosely with React `react-syntax-highlighter` `highlightProps`.
 * Unsupported keys are ignored in this first release.
 */
export interface CodeHighlighterHighlightProps {
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  wrapLines?: boolean;
  /** Custom Prism theme CSSProperties map (oneLight-like). */
  style?: Record<string, CSSProperties>;
  codeTagProps?: HTMLAttributes & Record<string, unknown>;
  [key: string]: unknown;
}

export interface CodeHighlighterProps {
  /**
   * @desc 代码语言类型
   * @descEN Code language type
   */
  lang?: string;
  /**
   * @desc 代码内容（与 React children 对齐；也可用默认插槽）
   * @descEN Code content (aligned with React children; default slot also works)
   */
  children?: string;
  /**
   * @desc 头部内容，为 false / null 时不显示头部
   * @descEN Header content; false / null hides the header
   */
  header?: AvoidValidation<false | null | VNode | string | (() => VNode | string | false | null)>;
  /**
   * @desc 样式类名的前缀
   * @descEN Prefix for style classnames
   */
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  /**
   * @desc 根节点样式
   * @descEN Root node style
   */
  style?: CSSProperties;
  /**
   * @desc 语法高亮器的额外属性
   * @descEN Additional props for syntax highlighter
   */
  highlightProps?: CodeHighlighterHighlightProps;
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<CodeHighlighterSemanticType, string>>;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<CodeHighlighterSemanticType, CSSProperties>>;
  /**
   * @desc 是否使用 Prism 轻量模式，根据 lang 自动按需加载语言支持以减少打包体积
   * @descEN Whether to use Prism light mode; loads language support based on lang to reduce bundle size
   * @default true
   */
  prismLightMode?: boolean;
}

export type { CodeHighlighterSemanticType as SemanticType };
