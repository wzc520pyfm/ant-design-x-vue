<script setup lang="ts">
defineOptions({ name: 'AXFolderContextMenuV2Setup' });

import { h, ref } from 'vue';
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
          { key: 'edit', label: 'Edit README', icon: h(EditOutlined) },
          { key: 'copy', label: 'Copy Path', icon: h(CopyOutlined) },
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
    default:
      lastAction.value = `${actionKey}: ${fullPathKey}`;
  }
};

const contextMenuWithHandler: FolderProps['contextMenu'] = (node, key) => {
  const isFolder = !!node.children && node.children.length > 0;
  const items = isFolder
    ? [
        { key: 'newFile', label: 'New File', icon: h(FileAddOutlined) },
        { key: 'copyPath', label: 'Copy Path', icon: h(CopyOutlined) },
        { type: 'divider' as const },
        { key: 'delete', label: 'Delete', icon: h(DeleteOutlined), danger: true },
      ]
    : [
        { key: 'copyPath', label: 'Copy Path', icon: h(CopyOutlined) },
        { key: 'rename', label: 'Rename', icon: h(EditOutlined) },
        { type: 'divider' as const },
        { key: 'delete', label: 'Delete', icon: h(DeleteOutlined), danger: true },
      ];
  return items.map((item) =>
    'key' in item
      ? { ...item, onClick: () => handleMenuAction(String(item.key), key) }
      : item,
  );
};

const onRightClick: FolderProps['onRightClick'] = ({ node }) => {
  lastAction.value = `Right-clicked: ${String(node?.title ?? node?.key)}`;
};
</script>

<template>
  <div style="height: 420px">
    <Space style="margin-bottom: 12px; display: flex; flex-wrap: wrap">
      <Tag color="blue">Right-click any file or folder</Tag>
      <Tag v-if="lastAction" color="green">{{ lastAction }}</Tag>
    </Space>
    <Folder
      ref="folderRef"
      :tree-data="data"
      :default-selected-file="['my-project', 'src', 'App.vue']"
      :context-menu="contextMenuWithHandler"
      @right-click="onRightClick"
    />
  </div>
</template>
