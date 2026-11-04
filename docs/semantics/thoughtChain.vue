<script setup lang="tsx">
import { CheckCircleOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import { ThoughtChain } from 'ant-design-x-vue'
import { Button, Divider, Flex } from 'ant-design-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticThoughtChain' })

const customizationProps = {
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  footer: <Button block>Thought Chain Item Footer</Button>,
  content: 'Thought Chain Item Content',
}

const items = [
  {
    ...customizationProps,
    status: 'success',
  },
]

defineRender(() => {
  return (
    <Flex vertical>
      <SemanticPreview
        semantics={[
          { name: 'root', desc: '根节点' },
          { name: 'item', desc: '思维链节点' },
          { name: 'itemIcon', desc: '思维链图标' },
          { name: 'itemHeader', desc: '思维链节点头部' },
          { name: 'itemContent', desc: '思维链节点内容' },
          { name: 'itemFooter', desc: '思维链节点页脚' },
        ]}
      >
        {({ classNames }) => <ThoughtChain classNames={classNames} items={items} />}
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      <SemanticPreview
        semantics={[
          { name: 'root', desc: '根节点' },
          { name: 'icon', desc: '思维链图标' },
          { name: 'title', desc: '思维链标题' },
          { name: 'description', desc: '思维链节点描述' },
        ]}
      >
        {({ classNames }) => (
          <ThoughtChain.Item
            classNames={classNames}
            variant="solid"
            icon={<GlobalOutlined />}
            title="Opening Webpage"
            description="https://x.ant.design/docs/playground/copilot"
          />
        )}
      </SemanticPreview>
    </Flex>
  )
})
</script>
