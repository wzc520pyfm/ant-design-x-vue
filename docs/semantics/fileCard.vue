<script setup lang="tsx">
import { FileCard } from 'ant-design-x-vue'
import { Divider, Flex } from 'ant-design-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticFileCard' })

defineRender(() => {
  return (
    <Flex vertical>
      <SemanticPreview
        semantics={[
          { name: 'root', desc: '根节点' },
          { name: 'file', desc: '文件' },
          { name: 'icon', desc: '图标' },
          { name: 'name', desc: '名称' },
          { name: 'description', desc: '描述' },
        ]}
      >
        {({ classNames }) => (
          <FileCard classNames={classNames} name="pdf-file.pdf" byte={1024} />
        )}
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      <SemanticPreview
        semantics={[
          { name: 'root', desc: '根节点' },
          { name: 'card', desc: '卡片' },
          { name: 'file', desc: '文件' },
          { name: 'icon', desc: '图标' },
          { name: 'name', desc: '名称' },
          { name: 'description', desc: '描述' },
        ]}
      >
        {({ classNames }) => (
          <FileCard.List
            classNames={classNames}
            items={new Array(3).fill({
              name: 'excel-file.xlsx',
              byte: 1024,
            })}
          />
        )}
      </SemanticPreview>
    </Flex>
  )
})
</script>
