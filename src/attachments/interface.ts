import type { ImageProps, UploadChangeParam, UploadFile, UploadProps } from "ant-design-vue";
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

export type PlaceholderType = PlaceholderConfig | VNode | string;

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
  imageProps?: ImageProps;

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
  imageProps?: ImageProps;
  icon?: VNode | PresetIcons;
  type?: 'file' | 'image';
}

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}

export type Attachment = UploadProps['fileList'][number] & {
  description?: VNode | string;
};

// refer from the UploadProps of ant-design-vue
export interface AntdUploadProps {
  capture?: UploadProps['capture'];
  type?: UploadProps['type'];
  name?: UploadProps['name'];
  defaultFileList?: UploadProps['defaultFileList'];
  /** @deprecated remove this prop */
  // fileList?: UploadProps['fileList'];
  action?: UploadProps['action'];
  directory?: UploadProps['directory'];
  data?: UploadProps['data'];
  method?: UploadProps['method'];
  headers?: UploadProps['headers'];
  showUploadList?: UploadProps['showUploadList'];
  multiple?: UploadProps['multiple'];
  accept?: UploadProps['accept'];
  beforeUpload?: UploadProps['beforeUpload'];
  onChange?: UploadProps['onChange'];
  'onUpdate:fileList'?: UploadProps['onUpdate:fileList'];
  onDrop?: UploadProps['onDrop'];
  listType?: UploadProps['listType'];
  onPreview?: UploadProps['onPreview'];
  onDownload?: UploadProps['onDownload'];
  onReject?: UploadProps['onReject'];
  onRemove?: UploadProps['onRemove'];
  /** @deprecated Please use `onRemove` directly */
  remove?: UploadProps['remove'];
  supportServerRender?: UploadProps['supportServerRender'];
  disabled?: UploadProps['disabled'];
  prefixCls?: UploadProps['prefixCls'];
  customRequest?: UploadProps['customRequest'];
  withCredentials?: UploadProps['withCredentials'];
  openFileDialogOnClick?: UploadProps['openFileDialogOnClick'];
  locale?: UploadProps['locale'];
  id?: UploadProps['id'];
  previewFile?: UploadProps['previewFile'];
  /** @deprecated Please use `beforeUpload` directly */
  transformFile?: UploadProps['transformFile'];
  iconRender?: UploadProps['iconRender'];
  isImageUrl?: UploadProps['isImageUrl'];
  progress?: UploadProps['progress'];
  itemRender?: UploadProps['itemRender'];
  /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
  maxCount?: UploadProps['maxCount'];
  height?: UploadProps['height'];
  removeIcon?: UploadProps['removeIcon'];
  downloadIcon?: UploadProps['downloadIcon'];
  previewIcon?: UploadProps['previewIcon'];
}

export interface AttachmentsProps extends AntdUploadProps {
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
  imageProps?: FileListProps['imageProps'];

  onChange?: (info: UploadChangeParam<UploadFile>) => void;
}

export interface AttachmentsRef {
  nativeElement: HTMLDivElement | null;
  upload: (file: File | File[] | FileList) => void;
}


export type PresetIcons = 'default' | 'excel' | 'image' | 'markdown' | 'pdf' | 'ppt' | 'word' | 'zip' | 'video' | 'audio';
