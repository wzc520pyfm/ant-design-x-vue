<script setup lang="tsx">
import { Think } from 'ant-design-x-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticThink' })

defineRender(() => {
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: '根节点' },
        { name: 'status', desc: '状态区' },
        { name: 'content', desc: '内容区' },
      ]}
    >
      {({ classNames }) => (
        <Think classNames={classNames} title="deep thinking">
          This is deep thinking content.
        </Think>
      )}
    </SemanticPreview>
  )
})
</script>
