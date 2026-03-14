import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AvoidValidation } from '../type-utility';

export type SemanticType = 'root' | 'title' | 'content';

export interface SourcesItem {
  key?: string | number;
  title: AvoidValidation<VNode | string>;
  url?: string;
  icon?: VNode;
  description?: AvoidValidation<VNode | string>;
}

export interface SourcesProps
  extends Omit<HTMLAttributes, 'title' | 'onClick'> {
  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style class names.
   */
  prefixCls?: string;

  /**
   * @desc 自定义样式，用于各个部分。
   * @descEN Custom styles for different parts.
   */
  styles?: Partial<Record<SemanticType, CSSProperties>>;

  /**
   * @desc 自定义样式类名，用于各个部分。
   * @descEN Custom style class names for different parts.
   */
  classNames?: Partial<Record<SemanticType, string>>;

  /**
   * @desc 根节点的样式类名。
   * @descEN Style class name for the root node.
   */
  rootClassName?: string;

  /**
   * @desc 是否使用内联模式（Popover悬浮卡片）。
   * @descEN Whether to use inline mode (Popover card).
   */
  inline?: boolean;

  /**
   * @desc 数据源列表。
   * @descEN Data source list.
   */
  items?: SourcesItem[];

  /**
   * @desc 标题。
   * @descEN Title.
   */
  title?: AvoidValidation<VNode | string>;

  /**
   * @desc 展开图标位置。
   * @descEN Position of the expand icon.
   */
  expandIconPosition?: 'start' | 'end';

  /**
   * @desc 点击数据源项时的回调。
   * @descEN Callback when a source item is clicked.
   */
  onClick?: (item: SourcesItem) => void;

  /**
   * @desc Popover 悬浮卡片的宽度。
   * @descEN Width of the Popover overlay.
   */
  popoverOverlayWidth?: number | string;

  /**
   * @desc 当前活跃项的 key（内联模式下使用）。
   * @descEN Active item key (used in inline mode).
   */
  activeKey?: string | number;

  /**
   * @desc 是否展开（受控）。
   * @descEN Whether expanded (controlled).
   */
  expanded?: boolean;

  /**
   * @desc 展开/折叠回调。
   * @descEN Callback when expand state changes.
   */
  onExpand?: (expand: boolean) => void;

  /**
   * @desc 默认是否展开。
   * @descEN Default expanded state.
   */
  defaultExpanded?: boolean;
}
