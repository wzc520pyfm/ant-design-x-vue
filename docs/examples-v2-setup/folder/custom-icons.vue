<script setup lang="ts">
defineOptions({ name: 'AXFolderCustomIconsV2Setup' });

import { h } from 'vue';
import { FileMarkdownOutlined, Html5Outlined } from '@ant-design/icons-vue';
import { Folder, type FolderProps } from 'ant-design-x-vue';

const treeData: FolderProps['treeData'] = [
  {
    title: 'pages',
    path: 'pages',
    children: [
      { title: 'index.html', path: 'index.html', content: '<!doctype html>' },
      { title: 'readme.md', path: 'readme.md', content: '# Pages' },
    ],
  },
];

const directoryIcons: FolderProps['directoryIcons'] = {
  directory: () => '📁',
  md: () => h(FileMarkdownOutlined),
  html: () => h(Html5Outlined),
};
</script>

<template>
  <div style="height: 320px">
    <Folder
      :tree-data="treeData"
      :default-selected-file="['pages', 'readme.md']"
      :directory-icons="directoryIcons"
    />
  </div>
</template>
