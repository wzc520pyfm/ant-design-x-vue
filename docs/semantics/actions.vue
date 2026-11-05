<script setup lang="tsx">
import { CopyOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import { Actions } from 'ant-design-x-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticActions' })

const items = [
  {
    key: 'copy',
    label: 'Copy',
    icon: <CopyOutlined />,
  },
  {
    key: 'more',
    subItems: [
      {
        key: 'share',
        label: 'Share',
        icon: <ShareAltOutlined />,
      },
      { key: 'import', label: 'Import' },
    ],
  },
]

defineRender(() => {
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: '根节点' },
        { name: 'item', desc: '操作项' },
        { name: 'itemDropdown', desc: '操作下拉选项' },
      ]}
    >
      {({ classNames }) => (
        <Actions
          classNames={classNames}
          items={items}
          dropdownProps={{
            open: true,
            getPopupContainer: (triggerNode) => triggerNode.parentElement!,
            placement: 'topLeft',
          }}
        />
      )}
    </SemanticPreview>
  )
})
</script>
