import type { UploadChangeParam, UploadFile, UploadProps } from "ant-design-vue";
import type { CSSProperties, VNode } from "vue";

export interface AttachmentContextProps {
  disabled?: boolean;
}

export interface DropUploaderProps {
  prefixCls: string;
  className: string;
  getDropContainer?: null | (() => HTMLElement | null | undefined);
  children?: VNode;
}

export interface SilentUploaderProps {
  children: VNode;
  upload: UploadProps;
  rootClassName?: string;
}

export interface PlaceholderConfig {
  icon?: VNode;
  title?: VNode | string;
  description?: VNode | string;
}

export type PlaceholderType = PlaceholderConfig | VNode;

export interface PlaceholderProps {
  prefixCls: string;
  placeholder?: PlaceholderType;
  upload?: UploadProps;
  className?: string;
  style?: CSSProperties;
}

export type SemanticType = 'list' | 'item' | 'placeholder';

export interface FileListProps {
  prefixCls: string;
  items: Attachment[];
  onRemove: (item: Attachment) => void;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  upload: UploadProps;

  // Semantic
  listClassName?: string;
  listStyle?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
}


export interface FileListCardProps {
  prefixCls?: string;
  item: Attachment;
  onRemove?: (item: Attachment) => void;
  className?: string;
  style?: CSSProperties;
}

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}

export type Attachment = UploadProps['fileList'][number] & {
  description?: VNode | string;
};

export interface AttachmentsProps extends Omit<UploadProps, 'fileList'> {
  prefixCls?: string;

  rootClassName?: string;
  rootStyle?: CSSProperties;

  style?: CSSProperties;
  className?: string;

  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;

  children?: VNode;

  disabled?: boolean;

  // ============= placeholder =============
  placeholder?: PlaceholderType | ((type: 'inline' | 'drop') => PlaceholderType);
  getDropContainer?: null | (() => HTMLElement | null | undefined);

  // ============== File List ==============
  items?: Attachment[];
  overflow?: FileListProps['overflow'];

  beforeUpload?: UploadProps['beforeUpload'];
  onChange?: (info: UploadChangeParam<UploadFile>) => void;
}

export interface AttachmentsRef {
  nativeElement: HTMLDivElement | null;
  upload: (file: File) => void;
}
