<script setup lang="ts">
defineOptions({ name: 'AXFolderPreviewRenderV2Setup' });

import { h } from 'vue';
import { Folder, type FolderProps } from 'ant-design-x-vue';

const treeData: FolderProps['treeData'] = [
  {
    title: 'notes.txt',
    path: 'notes.txt',
    content: 'line1\nline2\nline3',
  },
];

const previewRender: FolderProps['previewRender'] = (file, { originNode }) =>
  h('div', [
    h(
      'div',
      { style: { marginBottom: '8px', color: '#1677ff' } },
      `custom preview · lang=${file.language}`,
    ),
    originNode,
  ]);
</script>

<template>
  <div style="height: 280px">
    <Folder
      :tree-data="treeData"
      :default-selected-file="['notes.txt']"
      :preview-render="previewRender"
    />
  </div>
</template>
