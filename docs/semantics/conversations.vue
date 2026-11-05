<script setup lang="tsx">
import type { ConversationsProps } from 'ant-design-x-vue'
import { Conversations } from 'ant-design-x-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticConversations' })

const items: ConversationsProps['items'] = [
  { key: 'write', label: 'Help Me Write' },
  { key: 'coding', label: 'AI Coding' },
  { key: 'createImage', label: 'Create Image' },
  { key: 'deepSearch', label: 'Deep Search' },
  { key: 'divider', type: 'divider' },
  { group: 'Today', key: 'today-1', label: 'Conversation Item 1' },
  { group: 'Today', key: 'today-2', label: 'Conversation Item 2' },
]

defineRender(() => {
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: '管理对话根节点' },
        { name: 'item', desc: '管理对话子节点' },
        { name: 'creation', desc: '创建对话' },
        { name: 'group', desc: '管理对话分组' },
      ]}
    >
      {({ classNames }) => (
        <Conversations
          style={{ width: 200 }}
          classNames={classNames}
          creation={{ onClick: () => {} }}
          items={items}
          defaultActiveKey="write"
          groupable
        />
      )}
    </SemanticPreview>
  )
})
</script>
