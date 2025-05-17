import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AnyObject } from '../_util/type';
import GroupTitle from './GroupTitle.vue';
import type { ConfigProviderProps, DirectionType } from 'ant-design-vue/es/config-provider';
import type { MenuProps } from 'ant-design-vue';
import type { AvoidValidation } from '../type-utility';

type GroupType = string;

/**
 * @desc 会话数据
 * @descEN Conversation data
 */
export interface Conversation extends AnyObject {
  /**
   * @desc 唯一标识
   * @descEN Unique identifier
   */
  key: string;

  /**
   * @desc 会话名称
   * @descEN Conversation name
   */
  label?: VNode | string;

  /**
   * @desc 会话时间戳
   * @descEN Conversation timestamp
   */
  timestamp?: number;

  /**
   * @desc 会话分组类型，与 {@link ConversationsProps.groupable} 联动
   * @descEN Conversation type
   */
  group?: GroupType;

  /**
   * @desc 会话图标
   * @descEN conversation icon
   */
  icon?: VNode;

  /**
   * @desc 是否禁用
   * @descEN Whether to disable
   */
  disabled?: boolean;
}

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends HTMLAttributes {
  /**
   * @desc 会话列表数据源
   * @descEN Data source for the conversation list
   */
  items?: Conversation[];

  /**
   * @desc 当前选中的值
   * @descEN Currently selected value
   */
  activeKey?: Conversation['key'];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultActiveKey?: Conversation['key'];

  /**
   * @desc 选中变更回调
   * @descEN Callback for selection change
   */
  onActiveChange?: (value: string) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: ConversationsItemProps['menu'] | ((value: Conversation) => ConversationsItemProps['menu']);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link Conversation.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link Conversation.group} field
   */
  groupable?: AvoidValidation<boolean | Groupable>;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<'item', CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<'item', string>>;

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

export interface ConversationsItemProps extends Omit<HTMLAttributes, 'onClick'> {
  info: Conversation;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: MenuProps & {
    trigger?:
      | VNode
      | ((conversation: Conversation, info: { originNode: VNode }) => VNode);
      getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
  active?: boolean;
  onClick?: (info: Conversation) => void;
}

export type GroupSorter = Parameters<GroupType[]['sort']>[0];

export type GroupTitleRenderComponents = {
  components: {
    GroupTitle: typeof GroupTitle;
  };
};

export type GroupTitleRender =
  | ((group: GroupType, info: GroupTitleRenderComponents) => VNode)
  | undefined;

export interface Groupable {
  /**
   * @desc 分组排序函数
   * @descEN Group sorter
   */
  sort?: GroupSorter;
  /**
   * @desc 自定义分组标签渲染
   * @descEN Semantic custom rendering
   */
  title?: GroupTitleRender;
}

export interface GroupTitleContextProps {
  prefixCls?: ConfigProviderProps['prefixCls'];
}
