import type { MenuItemProps, MenuProps } from 'ant-design-vue';
import type { CSSProperties, HTMLAttributes, VNode } from 'vue';

type DataAttributes = {
  [Key in `data-${string}`]: string | number;
};

export interface SubItemType extends Pick<MenuItemProps, 'danger'>, DataAttributes {
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string;
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: VNode;
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void;
}

export interface ItemType extends DataAttributes {
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string;
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: VNode;
  /**
   * @desc 子操作项
   * @descEN Child action items.
   */
  children?: ActionItem[];
  /**
   * @desc 触发子菜单的操作方式
   * @descEN Action to trigger the sub-menu.
   */
  triggerSubMenuAction?: MenuProps['triggerSubMenuAction'];
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void;
}

export type ActionItem = SubItemType | ItemType;

export interface ActionsProps extends Omit<HTMLAttributes, 'onClick'> {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: ActionItem[];
  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
  /**
   * @desc 子操作项是否占据一行
   * @descEN Whether the child action items occupy a line.
   * @default false
   */
  block?: boolean;
  /**
   * @desc Item 操作项被点击时的回调函数。
   * @descEN Callback function when an action item is clicked.
   */
  onClick?: (menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }) => void;
  /**
   * @desc 根节点样式
   * @descEN Style for the root node.
   */
  style?: CSSProperties;
  /**
   * @desc 变体
   * @descEN Variant.
   * @default 'borderless'
   */
  variant?: 'borderless' | 'border';
  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style class names.
   */
  prefixCls?: string;
}

