<script setup lang="tsx">
defineOptions({ name: 'AXFolderCustomIconsV2' });

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

defineRender(() => (
  <div style={{ height: 320 }}>
    <Folder
      treeData={treeData}
      defaultSelectedFile={['pages', 'readme.md']}
      directoryIcons={{
        directory: () => <span>📁</span>,
        md: () => <FileMarkdownOutlined />,
        html: () => <Html5Outlined />,
      }}
    />
  </div>
));
</script>
