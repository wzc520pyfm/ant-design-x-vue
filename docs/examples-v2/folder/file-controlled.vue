<script setup lang="tsx">
defineOptions({ name: 'AXFolderFileControlledV2' });

import { Button, Space } from 'ant-design-vue';
import { Folder, type FolderProps } from 'ant-design-x-vue';
import { ref } from 'vue';

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

defineRender(() => (
  <div style={{ height: 360 }}>
    <Space style={{ marginBottom: 12 }}>
      <Button onClick={() => (selectedFile.value = ['docs', 'guide.md'])}>Select guide.md</Button>
      <Button onClick={() => (selectedFile.value = ['docs', 'api.md'])}>Select api.md</Button>
    </Space>
    <Folder
      treeData={treeData}
      selectedFile={selectedFile.value}
      onSelectedFileChange={(file) => {
        selectedFile.value = file.path;
      }}
    />
  </div>
));
</script>
