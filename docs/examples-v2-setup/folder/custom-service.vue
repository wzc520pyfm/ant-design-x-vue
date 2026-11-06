<script setup lang="ts">
defineOptions({ name: 'AXFolderCustomServiceV2Setup' });

import { Folder, type FolderProps } from 'ant-design-x-vue';

const treeData: FolderProps['treeData'] = [
  {
    title: 'remote',
    path: 'remote',
    children: [
      { title: 'a.ts', path: 'a.ts' },
      { title: 'b.ts', path: 'b.ts' },
    ],
  },
];

const fileContentService: FolderProps['fileContentService'] = {
  async loadFileContent(filePath) {
    await new Promise((r) => setTimeout(r, 300));
    return `// loaded from service: ${filePath}\nexport default {};`;
  },
};
</script>

<template>
  <div style="height: 360px">
    <Folder
      :tree-data="treeData"
      :file-content-service="fileContentService"
      :default-selected-file="['remote', 'a.ts']"
    />
  </div>
</template>
