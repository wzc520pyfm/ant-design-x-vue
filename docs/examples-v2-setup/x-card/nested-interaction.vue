<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { registerCatalog, XCard, type ActionPayload, type XAgentCommand_v0_9 } from '@ant-design-x-vue/x-card';

type FileNode = { key: string; name: string; type: 'file' | 'folder'; description?: string; children?: FileNode[] };
type FileDetail = { name: string; path: string; description: string };

const tree: FileNode[] = [
  {
    key: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { key: 'src/App.vue', name: 'App.vue', type: 'file', description: '应用入口组件' },
      { key: 'src/hooks/useTheme.ts', name: 'useTheme.ts', type: 'file', description: '主题 hook' },
    ],
  },
  { key: 'package.json', name: 'package.json', type: 'file', description: '依赖与脚本' },
];

registerCatalog({
  $id: 'local://nested',
  catalogId: 'local://nested',
  components: {
    Shell: { type: 'object' },
    FileTree: { type: 'object' },
    FileDetailCard: { type: 'object' },
  },
});

const Shell = defineComponent({
  name: 'Shell',
  setup(_, { slots }) {
    return () => h('div', { style: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px' } }, slots.default?.());
  },
});

const TreeNode = defineComponent({
  name: 'TreeNode',
  props: {
    node: { type: Object, required: true },
    selectedKey: { type: String, default: '' },
    onFileClick: { type: Function, default: undefined },
  },
  setup(props) {
    const expanded = ref(props.node.type === 'folder');
    return () => {
      const node = props.node as FileNode;
      return h('div', [
        h(
          'button',
          {
            type: 'button',
            style: {
              display: 'block',
              width: '100%',
              textAlign: 'left',
              border: 0,
              background: props.selectedKey === node.key ? '#e6f4ff' : 'transparent',
              padding: '4px 6px',
              cursor: 'pointer',
            },
            onClick: () => {
              if (node.type === 'folder') expanded.value = !expanded.value;
              else props.onFileClick?.(node);
            },
          },
          `${node.type === 'folder' ? (expanded.value ? '📂' : '📁') : '📄'} ${node.name}`,
        ),
        expanded.value && node.children
          ? h(
              'div',
              { style: { paddingLeft: '14px' } },
              node.children.map((child) =>
                h(TreeNode, { key: child.key, node: child, selectedKey: props.selectedKey, onFileClick: props.onFileClick }),
              ),
            )
          : null,
      ]);
    };
  },
});

const FileTree = defineComponent({
  name: 'FileTree',
  props: {
    files: { type: Array, default: () => [] },
    selectedFile: { type: Object, default: undefined },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { style: { border: '1px solid #eee', borderRadius: '12px', padding: '8px' } },
        (props.files as FileNode[]).map((node) =>
          h(TreeNode, {
            key: node.key,
            node,
            selectedKey: (props.selectedFile as FileDetail | undefined)?.path,
            onFileClick: (file: FileNode) => {
              props.onAction?.(props.action?.event?.name || 'select_file', {
                selectedFile: { name: file.name, path: file.key, description: file.description || '' },
              });
            },
          }),
        ),
      );
  },
});

const FileDetailCard = defineComponent({
  name: 'FileDetailCard',
  props: { file: { type: Object, default: undefined } },
  setup(props) {
    return () => {
      const file = props.file as FileDetail | undefined;
      if (!file) return h('p', { style: { color: '#999' } }, '点击文件查看详情');
      return h('div', { style: { border: '1px solid #eee', borderRadius: '12px', padding: '12px' } }, [
        h('h4', { style: { margin: '0 0 8px' } }, file.name),
        h('code', file.path),
        h('p', { style: { margin: '8px 0 0' } }, file.description),
      ]);
    };
  },
});

const commands = ref<XAgentCommand_v0_9[]>([
  { version: 'v0.9', createSurface: { surfaceId: 'browser', catalogId: 'local://nested' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'browser',
      components: [
        { id: 'root', component: 'Shell', children: ['tree', 'detail'] },
        {
          id: 'tree',
          component: 'FileTree',
          files: { path: '/files' },
          selectedFile: { path: '/selectedFile' },
          action: { event: { name: 'select_file', context: { selectedFile: { path: '/selectedFile' } } } },
        },
        { id: 'detail', component: 'FileDetailCard', file: { path: '/selectedFile' } },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'browser', path: '/', value: { files: tree } } },
]);

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'select_file') return;
  commands.value = [
    ...commands.value,
    { version: 'v0.9', updateDataModel: { surfaceId: 'browser', path: '/selectedFile', value: payload.context.selectedFile } },
  ];
};
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Shell, FileTree, FileDetailCard }" :on-action="handleAction">
    <XCard.Card id="browser" />
  </XCard.Box>
</template>
