<script setup lang="tsx">
defineOptions({ name: 'AXFolderCustomServiceV2' });

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

defineRender(() => (
  <div style={{ height: 360 }}>
    <Folder
      treeData={treeData}
      fileContentService={fileContentService}
      defaultSelectedFile={['remote', 'a.ts']}
    />
  </div>
));
</script>
