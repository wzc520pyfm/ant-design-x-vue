<script setup lang="tsx">
import { Folder } from 'ant-design-x-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticFolder' })

const treeData = [
  {
    title: 'src',
    path: 'src',
    children: [
      { title: 'index.ts', path: 'index.ts', content: "export const x = 1;\n" },
    ],
  },
]

defineRender(() => {
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: '根节点' },
        { name: 'directoryTree', desc: '目录树区域' },
        { name: 'directoryTitle', desc: '目录标题' },
        { name: 'filePreview', desc: '文件预览区域' },
        { name: 'previewTitle', desc: '预览标题' },
        { name: 'previewRender', desc: '预览内容' },
      ]}
    >
      {({ classNames }) => (
        <div style={{ height: 280 }}>
          <Folder
            classNames={classNames}
            treeData={treeData}
            directoryTitle="Files"
            defaultSelectedFile={['src', 'index.ts']}
          />
        </div>
      )}
    </SemanticPreview>
  )
})
</script>
