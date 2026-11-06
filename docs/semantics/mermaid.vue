<script setup lang="tsx">
import { Mermaid } from 'ant-design-x-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticMermaid' })

defineRender(() => {
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: '根节点' },
        { name: 'header', desc: '头部' },
        { name: 'graph', desc: '图表区' },
        { name: 'code', desc: '代码区' },
      ]}
    >
      {({ classNames }) => (
        <Mermaid classNames={classNames}>
          {`graph TD
  A-->B`}
        </Mermaid>
      )}
    </SemanticPreview>
  )
})
</script>
