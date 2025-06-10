<script setup lang="tsx">
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'
import { Sender } from 'ant-design-x-vue'
import { Flex, Button } from 'ant-design-vue';
import { SmileOutlined } from '@ant-design/icons-vue'

defineRender(() => {
  return (
    <Flex vertical>
      <SemanticPreview semantics={[
            { name: 'prefix', desc: '前缀' },
            { name: 'input', desc: '输入框' },
            { name: 'actions', desc: '操作列表' },
          ]}
        >
        {({ classNames }) => {
          return (
            <Sender classNames={classNames} prefix={<Button type="text" icon={<SmileOutlined />} />} />
            )
          }
        }
      </SemanticPreview>
      <SemanticPreview semantics={[
            { name: 'header', desc: '头部' },
            { name: 'header-content', desc: '头部内容' },
            { name: 'footer', desc: '尾部' },
          ]}
        >
        {({ classNames }) => {
          return (
              <Sender
                classNames={classNames}
                header={
                  <Sender.Header open title="Header" classNames={{ header: classNames.header, content: classNames['header-content']}}>
                    Content
                  </Sender.Header>
                }
                footer={
                  <div>Footer</div>
                }
              />
            )
          }
        }
      </SemanticPreview>
    </Flex>
  )
})

</script>
