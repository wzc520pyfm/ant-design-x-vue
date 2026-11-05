<script setup lang="ts">
defineOptions({ name: 'AXFolderFileControlledV2Setup' });

import { ref } from 'vue';
import { Button, Space } from 'ant-design-vue';
import { Folder, type FolderProps } from 'ant-design-x-vue';

const treeData: FolderProps['treeData'] = [
  {
    title: 'docs',
    path: 'docs',
    children: [
      { title: 'guide.md', path: 'guide.md', content: '# Guide\nControlled selection.' },
      { title: 'api.md', path: 'api.md', content: '# API\nFolderProps...' },
    ],
  },
];

const selectedFile = ref<string[]>(['docs', 'guide.md']);
</script>

<template>
  <div style="height: 360px">
    <Space style="margin-bottom: 12px">
      <Button @click="selectedFile = ['docs', 'guide.md']">Select guide.md</Button>
      <Button @click="selectedFile = ['docs', 'api.md']">Select api.md</Button>
    </Space>
    <Folder
      :tree-data="treeData"
      :selected-file="selectedFile"
      @selected-file-change="(file) => (selectedFile = file.path)"
    />
  </div>
</template>
