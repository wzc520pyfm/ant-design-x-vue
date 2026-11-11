import type { CSSProperties, VNode } from 'vue';
import type { ItemType } from 'ant-design-vue/es/menu';
import type { AvoidValidation } from '../type-utility';

export type FolderSemanticType =
  | 'root'
  | 'directoryTree'
  | 'directoryTitle'
  | 'filePreview'
  | 'previewTitle'
  | 'previewRender';

/** File content service interface for dynamic loading. */
export interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}

export interface FolderTreeData {
  title: AvoidValidation<VNode | string>;
  path: string;
  content?: string;
  children?: FolderTreeData[];
  /**
   * Right-click context menu items for this node.
   * Set to `false` to disable. Function form receives the full path key.
   * Overrides the global `FolderProps.contextMenu`.
   */
  contextMenu?: AvoidValidation<
    ItemType[] | false | ((key: string) => ItemType[] | undefined)
  >;
}

export type FolderContextMenu =
  | ItemType[]
  | ((node: FolderTreeData, key: string) => ItemType[] | undefined);

export interface FolderSelectedFileInfo {
  path: string[];
  title?: FolderTreeData['title'];
  content?: string;
}

export interface FolderPreviewFileInfo {
  content?: string;
  path: string[];
  title?: FolderTreeData['title'];
  language: string;
}

export interface FolderProps {
  prefixCls?: string;
  class?: string;
  className?: string;
  rootClassName?: string;
  classNames?: Partial<Record<FolderSemanticType, string>>;
  styles?: Partial<Record<FolderSemanticType, CSSProperties>>;
  style?: CSSProperties;

  treeData: FolderTreeData[];
  directoryIcons?: AvoidValidation<
    | false
    | Record<
        'directory' | string,
        VNode | string | (() => VNode | string | null | undefined)
      >
  >;

  selectable?: boolean;
  selectedFile?: string[];
  defaultSelectedFile?: string[];
  onSelectedFileChange?: (file: FolderSelectedFileInfo) => void;

  /** Directory tree panel initial width. The divider can be dragged to resize. */
  directoryTreeWith?: number | string;

  emptyRender?: AvoidValidation<false | VNode | string | (() => VNode | string | null)>;
  previewRender?: AvoidValidation<
    | VNode
    | string
    | ((
        file: FolderPreviewFileInfo,
        info: { originNode: VNode },
      ) => VNode | string | null)
  >;

  defaultExpandedPaths?: string[];
  expandedPaths?: string[];
  defaultExpandAll?: boolean;
  onExpandedPathsChange?: (paths: string[]) => void;

  fileContentService?: FileContentService;

  onFileClick?: (filePath: string, content?: string) => void;
  onFolderClick?: (folderPath: string) => void;

  directoryTitle?: AvoidValidation<false | VNode | string | (() => VNode | string | null)>;
  previewTitle?: AvoidValidation<
    | false
    | VNode
    | string
    | ((info: {
        title: FolderTreeData['title'];
        path: string[];
        content: string;
      }) => VNode | string | null)
  >;

  /** Global right-click menu; overridable per node via `FolderTreeData.contextMenu`. */
  contextMenu?: AvoidValidation<FolderContextMenu>;
  onRightClick?: (info: { event: MouseEvent; node: any }) => void;
}

export interface FolderRef {
  nativeElement: HTMLDivElement | undefined;
  getNode: (path: string[]) => FolderTreeData | undefined;
  updateNode: (path: string[], data: Partial<FolderTreeData>) => FolderTreeData[];
  deleteNode: (path: string[]) => FolderTreeData[];
  addNode: (parentPath: string[], node: FolderTreeData) => FolderTreeData[];
}
