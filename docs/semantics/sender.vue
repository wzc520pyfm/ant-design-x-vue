<script setup lang="tsx">
import { SmileOutlined } from '@ant-design/icons-vue'
import { Sender } from 'ant-design-x-vue'
import { Button, Divider, Flex, Typography } from 'ant-design-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticSender' })

defineRender(() => {
  return (
    <Flex vertical>
      <SemanticPreview
        semantics={[
          { name: 'root', desc: '根节点' },
          { name: 'prefix', desc: '前缀' },
          { name: 'input', desc: '输入框' },
          { name: 'suffix', desc: '后缀' },
          { name: 'footer', desc: '底部' },
          { name: 'switch', desc: '开关' },
          { name: 'content', desc: '内容' },
        ]}
      >
        {({ classNames }) => (
          <Sender
            classNames={classNames}
            prefix={<Button type="text" icon={<SmileOutlined />} />}
            footer={
              <Flex gap="small" align="center">
                <Sender.Switch>Deep Search</Sender.Switch>
                <Typography.Text type="secondary">
                  Deep thinking can understand the intent behind.
                </Typography.Text>
              </Flex>
            }
          />
        )}
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      <SemanticPreview
        semantics={[
          { name: 'header', desc: '头部' },
          { name: 'content', desc: '头部-内容' },
        ]}
      >
        {({ classNames }) => (
          <Sender
            header={
              <Sender.Header open title="Header" classNames={classNames}>
                Content
              </Sender.Header>
            }
          />
        )}
      </SemanticPreview>
    </Flex>
  )
})
</script>
