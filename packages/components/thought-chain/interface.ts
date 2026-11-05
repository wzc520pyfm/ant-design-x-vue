import type { CSSProperties, HTMLAttributes, VNode } from 'vue';

export enum THOUGHT_CHAIN_ITEM_STATUS {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  ABORT = 'abort',
}

export interface ThoughtChainItemType {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: VNode | string | number | false;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: VNode | string;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: VNode | string;

  /**
   * @desc 思维节点内容
   * @descEN Thought chain item content
   */
  content?: VNode | string;

  /**
   * @desc 思维节点脚注
   * @descEN Thought chain item footer
   */
  footer?: VNode | string;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;

  /**
   * @desc 是否可折叠
   * @descEN Whether collapsible
   */
  collapsible?: boolean;

  /**
   * @desc 闪烁
   * @descEN blink
   */
  blink?: boolean;
}

export type SemanticType =
  | 'root'
  | 'item'
  | 'itemHeader'
  | 'itemIcon'
  | 'itemContent'
  | 'itemFooter';

export interface ThoughtChainProps extends Omit<HTMLAttributes, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItemType[];

  /**
   * @desc 初始化展开的节点
   * @descEN default expanded keys
   */
  defaultExpandedKeys?: string[];

  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[];

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 线条样式
   * @descEN Line style
   */
  line?: boolean | 'solid' | 'dashed' | 'dotted';

  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
}

export type ItemSemanticType = 'root' | 'icon' | 'title' | 'description';

export interface ThoughtChainItemProps extends Omit<HTMLAttributes, 'title' | 'content'> {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: VNode | string;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: VNode | string;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: VNode | string;

  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;

  /**
   * @desc 思维节点变体
   * @descEN Thought chain item variant
   */
  variant?: 'solid' | 'outlined' | 'text';

  /**
   * @desc 闪烁
   * @descEN blink
   */
  blink?: boolean;

  classNames?: Partial<Record<ItemSemanticType, string>>;
  styles?: Partial<Record<ItemSemanticType, CSSProperties>>;
}

export interface ThoughtChainNodeProps extends Omit<HTMLAttributes, 'onClick'> {
  info?: ThoughtChainItemType;
  line?: ThoughtChainProps['line'];
  index: number;
}

export interface ThoughtChainContextType {
  prefixCls?: string;
  expandedKeys?: string[];
  onItemExpand?: (curKey: string) => void;
  styles?: ThoughtChainProps['styles'];
  classNames?: ThoughtChainProps['classNames'];
}

export interface StatusProps {
  icon?: VNode | string | number;
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;
  prefixCls?: string;
  class?: string;
  style?: CSSProperties;
}
