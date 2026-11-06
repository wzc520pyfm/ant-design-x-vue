<script setup lang="tsx">
import type { Key } from 'ant-design-vue/es/vc-tree/interface';
import classnames from 'classnames';
import { computed, ref, watch, type CSSProperties } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useMergedState from '../_util/hooks/useMergedState';
import pickAttrs from '../_util/pick-attrs';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import DirectoryTree from './DirectoryTree.vue';
import FilePreview from './FilePreview.vue';
import Splitter from './Splitter.vue';
import type {
  FolderProps,
  FolderRef,
  FolderTreeData,
} from './interface';
import useStyle from './style';

defineOptions({ name: 'AXFolder', inheritAttrs: false });

const props = withDefaults(defineProps<FolderProps>(), {
  selectable: true,
  defaultExpandAll: true,
  directoryTreeWith: 278,
  styles: () => ({}),
  classNames: () => ({}),
  treeData: () => [],
});

const containerRef = ref<HTMLDivElement>();
const [locale] = useLocale('Folder', () => enUS.Folder!);

const getNodeByPath = (path: string[], data: FolderTreeData[] = props.treeData): FolderTreeData | undefined => {
  if (!path || path.length === 0 || !data) return undefined;
  const findNode = (nodes: FolderTreeData[], index = 0): FolderTreeData | undefined => {
    if (index >= path.length) return undefined;
    const segment = path[index];
    for (const node of nodes) {
      if (node.path === segment) {
        return index === path.length - 1
          ? node
          : node.children
            ? findNode(node.children, index + 1)
            : undefined;
      }
    }
    return undefined;
  };
  return findNode(data);
};

const walkTree = (
  nodes: FolderTreeData[],
  path: string[],
  index: number,
  action: 'update' | 'delete' | 'add',
  data?: Partial<FolderTreeData>,
): FolderTreeData[] => {
  const targetSegment = path[index];
  const isLast = index === path.length - 1;

  return nodes.map((node) => {
    if (node.path !== targetSegment) return node;

    if (isLast) {
      switch (action) {
        case 'update':
          return { ...node, ...data };
        case 'delete':
          return null as unknown as FolderTreeData;
        case 'add': {
          const newChild = data as FolderTreeData;
          const children = node.children ? [...node.children, newChild] : [newChild];
          return { ...node, children };
        }
        default:
          return node;
      }
    }

    if (node.children) {
      const newChildren = walkTree(node.children, path, index + 1, action, data);
      return { ...node, children: newChildren.filter(Boolean) as FolderTreeData[] };
    }
    return node;
  });
};

const findNodeAndValidate = (
  path: string | string[],
  validateAsFile = false,
): { node: FolderTreeData | undefined; isValid: boolean } => {
  if (!path) return { node: undefined, isValid: false };
  const segments = Array.isArray(path) ? path.filter(Boolean) : path.split('/').filter(Boolean);
  if (segments.length === 0) return { node: undefined, isValid: false };

  const node = getNodeByPath(segments);
  const isValid = validateAsFile
    ? !!node && (!node?.children || node.children.length === 0)
    : !!node;
  return { node, isValid };
};

const isValidSelectedFile = (filePath?: string[]): boolean =>
  !!(filePath && filePath.length > 0 && findNodeAndValidate(filePath, true).isValid);

const validSelectedFile = ref(
  isValidSelectedFile(props.selectedFile || props.defaultSelectedFile || []),
);

watch(
  () => [props.selectedFile, props.treeData, props.defaultSelectedFile] as const,
  () => {
    validSelectedFile.value = isValidSelectedFile(
      props.selectedFile || props.defaultSelectedFile || [],
    );
  },
);

const expandedPathsRef = computed(() => props.expandedPaths);
const [expandedPathsState, setExpandedPaths] = useMergedState<string[] | undefined>(
  props.defaultExpandedPaths,
  { value: expandedPathsRef as any },
);

const initialSelected = isValidSelectedFile(props.defaultSelectedFile || [])
  ? props.defaultSelectedFile || []
  : [];
const selectedFileRef = computed(() => props.selectedFile);
const [selectedFileState, setSelectedFileState] = useMergedState<string[]>(initialSelected, {
  value: selectedFileRef as any,
});

const fileContent = ref('');
const loadingContent = ref(false);

watch(
  () =>
    [
      validSelectedFile.value,
      selectedFileState.value,
      props.treeData,
      props.fileContentService,
    ] as const,
  async () => {
    if (!validSelectedFile.value || !selectedFileState.value?.length) {
      fileContent.value = '';
      loadingContent.value = false;
      return;
    }

    const filePath = selectedFileState.value.join('/');
    const segments = filePath.split('/').filter((segment) => segment !== '');
    const { node } = findNodeAndValidate(segments);

    if (props.fileContentService) {
      loadingContent.value = true;
      try {
        const content = await props.fileContentService.loadFileContent(filePath);
        fileContent.value = content;
      } catch (error) {
        fileContent.value = `// ${locale.value?.loadError}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
      } finally {
        loadingContent.value = false;
      }
    } else if (node?.content) {
      fileContent.value = node.content;
      loadingContent.value = false;
    } else {
      fileContent.value = `// ${locale.value.noService}`;
      loadingContent.value = false;
    }
  },
  { immediate: true },
);

defineExpose<FolderRef>({
  get nativeElement() {
    return containerRef.value;
  },
  getNode: (path: string[]) => getNodeByPath(path),
  updateNode: (path: string[], data: Partial<FolderTreeData>) =>
    props.treeData ? walkTree(props.treeData, path, 0, 'update', data) : [],
  deleteNode: (path: string[]) =>
    props.treeData
      ? (walkTree(props.treeData, path, 0, 'delete').filter(Boolean) as FolderTreeData[])
      : [],
  addNode: (parentPath: string[], node: FolderTreeData) =>
    props.treeData ? walkTree(props.treeData, parentPath, 0, 'add', node) : [],
});

const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('folder', props.prefixCls));
const contextConfig = useXComponentConfig('folder');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.class,
    props.className,
    props.rootClassName,
    props.classNames?.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-selectable`]: props.selectable,
    },
  ),
);

const mergedStyle = computed<CSSProperties>(() => ({
  ...contextConfig.value.style,
  ...props.styles?.root,
  ...props.style,
}));

const domProps = computed(() =>
  pickAttrs(props as any, { attr: true, aria: true, data: true }),
);

const handleSelect = (keys: Key[], info: any) => {
  const nodes = Array.isArray(info?.selectedNodes)
    ? info.selectedNodes
    : info?.selectedNodes
      ? [info.selectedNodes]
      : info?.node
        ? [info.node]
        : [];

  const isFolderClick = nodes.some((node: any) => !node.isLeaf);
  if (isFolderClick) {
    if (nodes.length === 1) {
      const node = nodes[0] as any;
      props.onFolderClick?.(node.path);
    }
    return;
  }

  const pathArray = String(keys[0] || '')
    .split('/')
    .filter(Boolean);
  if (pathArray.length === 0) return;

  const selectedNode = nodes[0] as FolderTreeData | undefined;
  const fileName = selectedNode?.title as string | undefined;
  const content = (selectedNode as any)?.content as string | undefined;

  props.onSelectedFileChange?.({ path: pathArray, title: fileName, content });

  const isControlled = props.selectedFile !== undefined;
  if (!isControlled) {
    validSelectedFile.value = true;
    setSelectedFileState(pathArray);
  }

  if (nodes.length === 1) {
    const node = nodes[0] as any;
    props.onFileClick?.(node.path, node.content);
  }
};

const handleExpand = (keys: Key[]) => {
  const newPaths = keys.map(String);
  setExpandedPaths(newPaths);
  props.onExpandedPathsChange?.(newPaths);
};

defineRender(() => {
  return wrapCSSVar(
    <div
      {...domProps.value}
      ref={containerRef}
      class={mergedCls.value}
      style={mergedStyle.value}
    >
      <div class={`${prefixCls.value}-container`}>
        <Splitter
          prefixCls={prefixCls.value}
          defaultSize={props.directoryTreeWith}
          rtl={direction.value === 'rtl'}
        >
          {{
            start: () => (
        <div
          class={classnames(
            `${prefixCls.value}-directory-tree`,
            props.classNames?.directoryTree,
          )}
          style={{
            ...contextConfig.value.styles?.directoryTree,
            ...props.styles?.directoryTree,
          }}
        >
          <DirectoryTree
            directoryIcons={props.directoryIcons}
            prefixCls={props.prefixCls}
            treeData={props.treeData}
            selectedKeys={
              props.selectable && selectedFileState.value && validSelectedFile.value
                ? [selectedFileState.value.join('/')]
                : []
            }
            classNames={props.classNames}
            styles={props.styles}
            expandedKeys={expandedPathsState.value}
            onSelect={handleSelect}
            onExpand={handleExpand}
            defaultExpandAll={props.defaultExpandAll}
            directoryTitle={props.directoryTitle}
            contextMenu={props.contextMenu}
            onRightClick={props.onRightClick}
          />
        </div>
            ),
            end: () => (
        <FilePreview
          emptyRender={props.emptyRender}
          prefixCls={props.prefixCls}
          classNames={props.classNames}
          styles={props.styles}
          selectedFile={validSelectedFile.value ? selectedFileState.value : []}
          fileContent={fileContent.value}
          loading={loadingContent.value}
          previewTitle={props.previewTitle}
          previewRender={props.previewRender}
          getFileNode={(path) => {
            if (!path || path.length === 0) return undefined;
            const { node } = findNodeAndValidate(path);
            return node
              ? { title: node.title, path: node.path, content: node.content }
              : undefined;
          }}
        />
            ),
          }}
        </Splitter>
      </div>
    </div>,
  );
});
</script>
