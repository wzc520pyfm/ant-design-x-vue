import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AnyObject } from '../_util/type';
import type GroupTitle from './GroupTitle.vue';
import type { ConfigProviderProps, DirectionType } from 'ant-design-vue/es/config-provider';
import type { MenuProps } from 'ant-design-vue';
import type { AvoidValidation } from '../type-utility';
import type { CollapsibleOptions } from '../_util/hooks/use-collapsible';
import type { GroupInfoType } from './hooks/useGroupable';

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

export type ConversationItemType = Conversation;

export interface DividerItemType {
  type: 'divider';
  key?: string;
  dashed?: boolean;
}

export type ItemType = ConversationItemType | DividerItemType;

export type GroupLabel =
  | VNode
  | string
  | ((
      group: string,
      info: {
        groupInfo: GroupInfoType;
      },
    ) => VNode)
  | undefined;

export type Collapsible = boolean | ((group: string) => boolean);

export interface GroupableProps extends CollapsibleOptions {
  /**
   * @desc 自定义分组标签渲染
   * @descEN Semantic custom rendering
   */
  label?: GroupLabel;
  collapsible?: Collapsible;
}

type SemanticType = 'root' | 'creation' | 'group' | 'item';

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends HTMLAttributes {
  /**
   * @desc 会话列表数据源
   * @descEN Data source for the conversation list
   */
  items?: ItemType[];

  /**
   * @desc 当前选中的值
   * @descEN Currently selected value
   */
  activeKey?: ConversationItemType['key'];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultActiveKey?: ConversationItemType['key'];

  /**
   * @desc 选中变更回调
   * @descEN Callback for selection change
   */
  onActiveChange?: (value: string) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: ConversationsItemProps['menu'] | ((value: ConversationItemType) => ConversationsItemProps['menu']);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link Conversation.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link Conversation.group} field
   */
  groupable?: AvoidValidation<boolean | GroupableProps>;

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

  /**
   * @desc 新建对话按钮的配置
   * @descEN Config of the new chat button
   */
  creation?: CreationProps;
}

export interface ConversationsItemProps extends Omit<HTMLAttributes, 'onClick'> {
  info: ConversationItemType;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: MenuProps & {
    trigger?:
      | VNode
      | ((conversation: ConversationItemType, info: { originNode: VNode }) => VNode);
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
  active?: boolean;
  onClick?: ConversationsProps['onActiveChange'];
}

export interface CreationProps {
  label?: VNode | string | ((info: CreationLabelInfo) => VNode);
  align?: 'start' | 'center' | 'end';
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  icon?: VNode | (() => VNode);
  onClick?: (event?: MouseEvent) => void;
}

export interface CreationLabelInfo {
  components: { CreationLabel: any };
}

export interface GroupTitleContextProps {
  prefixCls?: ConfigProviderProps['prefixCls'];
  groupInfo?: Omit<GroupInfoType, 'collapsible'> & { collapsible: boolean };
  enableCollapse?: boolean;
  expandedKeys?: string[];
  onItemExpand?: (curKey: string) => void;
}
