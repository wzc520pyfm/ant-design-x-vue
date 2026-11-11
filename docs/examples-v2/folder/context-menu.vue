<script setup lang="tsx">
defineOptions({ name: 'AXFolderContextMenuV2' });

import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
} from '@ant-design/icons-vue';
import { message, Space, Tag } from 'ant-design-vue';
import {
  Folder,
  type FolderProps,
  type FolderRef,
  type FolderTreeData,
} from 'ant-design-x-vue';
import { ref } from 'vue';

const initialTreeData: FolderProps['treeData'] = [
  {
    title: 'my-project',
    path: 'my-project',
    children: [
      {
        title: 'src',
        path: 'src',
        children: [
          {
            title: 'App.vue',
            path: 'App.vue',
            content: '<template><div>Hello</div></template>',
          },
        ],
      },
      {
        title: 'README.md',
        path: 'README.md',
        content: '# My Project',
        contextMenu: [
          { key: 'edit', label: 'Edit README', icon: <EditOutlined /> },
          { key: 'copy', label: 'Copy Path', icon: <CopyOutlined /> },
        ],
      },
    ],
  },
];

const folderRef = ref<FolderRef>();
const data = ref<FolderTreeData[]>(initialTreeData);
const lastAction = ref('');
let counter = 1;

const parseKey = (key: string) => key.split('/').filter(Boolean);

const baseMenu: FolderProps['contextMenu'] = (node) => {
  const isFolder = !!node.children && node.children.length > 0;
  if (isFolder) {
    return [
      { key: 'newFile', label: 'New File', icon: <FileAddOutlined /> },
      { key: 'copyPath', label: 'Copy Path', icon: <CopyOutlined /> },
      { type: 'divider' },
      { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
    ];
  }
  return [
    { key: 'copyPath', label: 'Copy Path', icon: <CopyOutlined /> },
    { key: 'rename', label: 'Rename', icon: <EditOutlined /> },
    { type: 'divider' },
    { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
  ];
};

const handleMenuAction = (actionKey: string, fullPathKey: string) => {
  const pathSegments = parseKey(fullPathKey);
  const api = folderRef.value;
  switch (actionKey) {
    case 'rename': {
      const newName = `renamed_${counter++}`;
      data.value = api?.updateNode(pathSegments, { title: newName, path: newName }) ?? data.value;
      message.success(`Renamed to ${newName}`);
      lastAction.value = `Rename: ${fullPathKey} → ${newName}`;
      break;
    }
    case 'delete': {
      data.value = api?.deleteNode(pathSegments) ?? data.value;
      message.success(`Deleted ${fullPathKey}`);
      lastAction.value = `Delete: ${fullPathKey}`;
      break;
    }
    case 'newFile': {
      const fileName = `new_file_${counter++}.ts`;
      data.value =
        api?.addNode(pathSegments, {
          title: fileName,
          path: fileName,
          content: `// ${fileName}`,
        }) ?? data.value;
      message.success(`Created ${fileName}`);
      lastAction.value = `New File: ${fileName}`;
      break;
    }
    case 'copyPath':
    case 'copy':
      navigator.clipboard?.writeText(fullPathKey);
      message.success(`Copied: ${fullPathKey}`);
      lastAction.value = `Copy Path: ${fullPathKey}`;
      break;
    case 'edit':
      message.info(`Edit: ${fullPathKey}`);
      lastAction.value = `Edit: ${fullPathKey}`;
      break;
    default:
      break;
  }
};

const contextMenuWithHandler: FolderProps['contextMenu'] = (node, key) => {
  const items = typeof baseMenu === 'function' ? baseMenu(node, key) : baseMenu;
  if (!items) return items;
  return items.map((item) => {
    if (item && 'key' in item) {
      return {
        ...item,
        onClick: () => handleMenuAction(String(item.key), key),
      };
    }
    return item;
  });
};

defineRender(() => (
  <div style={{ height: 420 }}>
    <Space style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap' }}>
      <Tag color="blue">Right-click any file or folder</Tag>
      {lastAction.value ? <Tag color="green">{lastAction.value}</Tag> : null}
    </Space>
    <Folder
      ref={folderRef as any}
      treeData={data.value}
      defaultSelectedFile={['my-project', 'src', 'App.vue']}
      contextMenu={contextMenuWithHandler}
      onRightClick={({ node }) => {
        lastAction.value = `Right-clicked: ${String(node?.title ?? node?.key)}`;
      }}
    />
  </div>
));
</script>
