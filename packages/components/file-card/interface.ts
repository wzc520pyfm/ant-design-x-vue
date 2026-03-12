import type { CSSProperties, VNode } from 'vue';
import type { ImageProps, SpinProps } from 'ant-design-vue';

export type SemanticType = 'root' | 'file' | 'icon' | 'name' | 'description';

export type PresetIcons =
  | 'default'
  | 'excel'
  | 'image'
  | 'markdown'
  | 'pdf'
  | 'ppt'
  | 'word'
  | 'zip'
  | 'video'
  | 'audio'
  | 'java'
  | 'javascript'
  | 'python';

export interface FileCardProps {
  prefixCls?: string;
  style?: CSSProperties;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  class?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  rootClassName?: string;
  name: string;
  byte?: number;
  size?: 'small' | 'default';
  description?: VNode | string;
  loading?: boolean;
  src?: string;
  mask?: VNode | string;
  icon?: VNode | PresetIcons;
  type?: 'file' | 'image' | 'audio' | 'video' | string;
  imageProps?: ImageProps;
  spinProps?: SpinProps & {
    showText?: boolean;
    icon?: VNode;
  };
  videoProps?: Record<string, any>;
  audioProps?: Record<string, any>;
  onClick?: () => void;
}

export type ListSemanticType = 'root' | 'card';

export interface FileCardListProps {
  prefixCls?: string;
  class?: string;
  classNames?: Partial<Record<ListSemanticType | SemanticType, string>>;
  rootClassName?: string;
  style?: CSSProperties;
  styles?: Partial<Record<ListSemanticType | SemanticType, CSSProperties>>;
  items: FileCardProps[];
  size?: 'small' | 'default';
  removable?: boolean | ((item: FileCardProps) => boolean);
  onRemove?: (item: FileCardProps) => void;
  extension?: VNode;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
}
