<script setup lang="tsx">
defineOptions({ name: 'AXFolderPreviewRenderV2' });

import { Folder, type FolderProps } from 'ant-design-x-vue';

const treeData: FolderProps['treeData'] = [
  {
    title: 'notes.txt',
    path: 'notes.txt',
    content: 'line1\nline2\nline3',
  },
];

defineRender(() => (
  <div style={{ height: 280 }}>
    <Folder
      treeData={treeData}
      defaultSelectedFile={['notes.txt']}
      previewRender={(file, { originNode }) => (
        <div>
          <div style={{ marginBottom: 8, color: '#1677ff' }}>
            custom preview · lang={file.language}
          </div>
          {originNode}
        </div>
      )}
    />
  </div>
));
</script>
