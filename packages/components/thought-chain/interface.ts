import type { CSSProperties, HTMLAttributes, VNode } from "vue";
import type { Collapsible } from "./hooks/useCollapsible";
import type { ConfigProviderProps } from "ant-design-vue";

export enum THOUGHT_CHAIN_ITEM_STATUS {
  /**
   * @desc 等待状态
   */
  PENDING = 'pending',
  /**
   * @desc 成功状态
   */
  SUCCESS = 'success',
  /**
   * @desc 错误状态
   */
  ERROR = 'error',
}

export interface ThoughtChainItem {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: VNode | string | number;

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
   * @desc 思维节点额外内容
   * @descEN Thought chain item extra content
   */
  extra?: VNode | string;

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
}

export type SemanticType = 'item' | 'itemHeader' | 'itemContent' | 'itemFooter';

export interface ThoughtChainProps extends Omit<HTMLAttributes, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItem[];

  /**
   * @desc 是否可折叠
   * @descEN Whether collapsible
   */
  collapsible?: Collapsible;

  /**
   * @desc 组件大小
   * @descEN Component size
   */
  size?: ConfigProviderProps['componentSize'];

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
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;
}

export interface ThoughtChainNodeContextProps {
  prefixCls?: string;
  // collapseMotion?: CSSMotionProps;
  enableCollapse?: boolean;
  expandedKeys?: string[];
  direction?: ConfigProviderProps['direction'];
  styles?: ThoughtChainProps['styles'];
  classNames?: ThoughtChainProps['classNames'];
}

export interface ThoughtChainNodeProps extends Omit<HTMLAttributes, 'onClick'> {
  info?: ThoughtChainItem;
  nextStatus?: ThoughtChainItem['status'];
  onClick?: (key: string) => void;
}
