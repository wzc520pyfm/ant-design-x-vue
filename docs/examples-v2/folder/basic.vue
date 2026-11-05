<script setup lang="tsx">
defineOptions({ name: 'AXFolderBasicV2' });

import { Folder, type FolderProps } from 'ant-design-x-vue';

const treeData: FolderProps['treeData'] = [
  {
    title: 'src',
    path: 'src',
    children: [
      {
        title: 'App.vue',
        path: 'App.vue',
        content: `<script setup lang="ts">\nconst msg = 'Hello Folder';\n<\/script>\n\n<template>\n  <div>{{ msg }}</div>\n</template>`,
      },
      {
        title: 'main.ts',
        path: 'main.ts',
        content: "import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');",
      },
    ],
  },
  {
    title: 'package.json',
    path: 'package.json',
    content: '{\n  "name": "demo",\n  "version": "1.0.0"\n}',
  },
];

defineRender(() => (
  <div style={{ height: 420 }}>
    <Folder
      treeData={treeData}
      directoryTitle="Project Files"
      defaultSelectedFile={['src', 'App.vue']}
    />
  </div>
));
</script>
