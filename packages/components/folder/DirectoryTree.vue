<script setup lang="tsx">
import { FileOutlined, FolderOutlined } from '@ant-design/icons-vue';
import { Dropdown, Menu, Tree } from 'ant-design-vue';
import type { ItemType } from 'ant-design-vue/es/menu';
import type { DataNode, EventDataNode, Key } from 'ant-design-vue/es/vc-tree/interface';
import classnames from 'classnames';
import { computed, ref, type CSSProperties, type VNode } from 'vue';
import { useXProviderContext } from '../x-provider';
import type { FolderContextMenu, FolderProps, FolderTreeData } from './interface';

defineOptions({ name: 'AXFolderDirectoryTree', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    treeData: FolderTreeData[];
    directoryIcons?: FolderProps['directoryIcons'];
    selectedKeys?: Key[];
    expandedKeys?: Key[];
    onSelect?: (keys: Key[], info: any) => void;
    onExpand?: (keys: Key[], info?: any) => void;
    showLine?: boolean;
    defaultExpandAll?: boolean;
    className?: string;
    classNames?: FolderProps['classNames'];
    styles?: FolderProps['styles'];
    style?: CSSProperties;
    directoryTitle?: FolderProps['directoryTitle'];
    prefixCls?: string;
    contextMenu?: FolderContextMenu;
    onRightClick?: FolderProps['onRightClick'];
  }>(),
  {
    showLine: false,
    defaultExpandAll: true,
    selectedKeys: () => [],
  },
);

const AntDirectoryTree = Tree.DirectoryTree;

const contextMenuOpen = ref(false);
const contextMenuItems = ref<ItemType[]>([]);
const nodeDataMap = ref(new Map<string, FolderTreeData>());
const isRightClick = ref(false);

const isFolderNode = (node: FolderTreeData): boolean =>
  !!node.children && node.children.length > 0;

const resolveIconNode = (
  icon: VNode | string | (() => VNode | string | null | undefined) | undefined,
  fallback: VNode,
): VNode | string | null => {
  if (icon === undefined) return fallback;
  const resolved = typeof icon === 'function' ? icon() : icon;
  return (resolved as any) ?? null;
};

const getIcon = (node: FolderTreeData): VNode | string | null => {
  const directoryIcons = props.directoryIcons;
  if (directoryIcons === false || directoryIcons == null) {
    return null;
  }

  if (isFolderNode(node)) {
    const icon = (directoryIcons as Record<string, any>)?.directory;
    return resolveIconNode(icon, (<FolderOutlined />) as VNode);
  }

  const filePath = node.path.toLowerCase();
  const extension = filePath.split('.').pop();
  if (extension) {
    const icon = (directoryIcons as Record<string, any>)?.[extension];
    if (icon) {
      return resolveIconNode(icon, (<FileOutlined />) as VNode);
    }
  }
  return (<FileOutlined />) as VNode;
};

const buildPathSegments = (node: FolderTreeData, parentSegments: string[] = []): string[] => {
  if (node.path === '/' && parentSegments.length === 0) {
    return ['/'];
  }
  return [...parentSegments, node.path].filter((segment) => segment !== '');
};

const convertToTreeData = (
  nodes: FolderTreeData[],
  parentSegments: string[] = [],
  map?: Map<string, FolderTreeData>,
): DataNode[] => {
  const nextMap = map ?? new Map<string, FolderTreeData>();

  const result = nodes.map((node) => {
    const pathSegments = buildPathSegments(node, parentSegments);
    const fullPath = pathSegments.join('/').replace(/^\/+/, '');
    nextMap.set(fullPath, node);
    return {
      ...node,
      key: fullPath,
      path: fullPath,
      pathSegments,
      title: node.title,
      icon: getIcon(node),
      isLeaf: !isFolderNode(node),
      children: node.children
        ? convertToTreeData(node.children, pathSegments, nextMap)
        : undefined,
    } as DataNode;
  });

  if (!map) {
    nodeDataMap.value = nextMap;
  }
  return result;
};

const treeDataConverted = computed(() => convertToTreeData(props.treeData || []));

const titleNode = computed(() => {
  const directoryTitle = props.directoryTitle;
  if (directoryTitle === false || directoryTitle == null) return null;
  return typeof directoryTitle === 'function' ? directoryTitle() : directoryTitle;
});

const { getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('folder', props.prefixCls));

const handleRightClick = (info: { event: MouseEvent; node: EventDataNode }) => {
  const nodeKey = String(info.node.key);
  const originalNode = nodeDataMap.value.get(nodeKey);

  isRightClick.value = true;

  let items: ItemType[] | undefined;
  if (originalNode?.contextMenu === false) {
    items = undefined;
  } else if (originalNode?.contextMenu) {
    items =
      typeof originalNode.contextMenu === 'function'
        ? originalNode.contextMenu(nodeKey)
        : (originalNode.contextMenu as ItemType[]);
  } else if (props.contextMenu) {
    items =
      typeof props.contextMenu === 'function'
        ? props.contextMenu(originalNode || ({} as FolderTreeData), nodeKey)
        : props.contextMenu;
  }

  if (items && items.length > 0) {
    contextMenuItems.value = items;
    contextMenuOpen.value = true;
  } else {
    isRightClick.value = false;
    contextMenuItems.value = [];
  }

  props.onRightClick?.(info);
};

const handleSelect = (keys: Key[], info: any) => {
  if (isRightClick.value) {
    isRightClick.value = false;
    return;
  }
  props.onSelect?.(keys, info);
};

const handleContextMenuOpenChange = (open: boolean) => {
  if (open && !isRightClick.value) {
    return;
  }
  contextMenuOpen.value = open;
  if (!open) {
    isRightClick.value = false;
  }
};

defineRender(() => {
  const cls = prefixCls.value;
  return (
    <>
      {titleNode.value ? (
        <div
          style={{ ...props.styles?.directoryTitle, ...props.style }}
          class={classnames(
            `${cls}-directory-tree-title`,
            props.className,
            props.classNames?.directoryTitle,
          )}
        >
          {titleNode.value}
        </div>
      ) : null}
      <Dropdown
        open={contextMenuOpen.value}
        trigger={['contextmenu']}
        onOpenChange={handleContextMenuOpenChange}
        v-slots={{
          overlay: () => <Menu items={contextMenuItems.value as any} />,
        }}
      >
        <div class={`${cls}-directory-tree-body`}>
          <AntDirectoryTree
            treeData={treeDataConverted.value}
            selectedKeys={props.selectedKeys}
            expandedKeys={props.expandedKeys}
            onSelect={handleSelect}
            onExpand={props.onExpand as any}
            onRightClick={handleRightClick}
            multiple={false}
            blockNode
            showLine={props.showLine}
            defaultExpandAll={props.defaultExpandAll}
            class={classnames(`${cls}-directory-tree-content`)}
          />
        </div>
      </Dropdown>
    </>
  );
});
</script>
