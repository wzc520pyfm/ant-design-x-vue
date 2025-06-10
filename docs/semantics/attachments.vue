<script setup lang="tsx">
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue'
import { Button, Flex, Space } from 'ant-design-vue';
import {CloudUploadOutlined} from '@ant-design/icons-vue'

const items: AttachmentsProps['items'] = Array.from({ length: 3 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

defineRender(() => {
  return (
    <Flex vertical>
      <SemanticPreview semantics={[
            { name: 'placeholder', desc: '占位符' },
          ]}
        >
        {({ classNames }) => {
          return (
            <Attachments
              classNames={classNames}
              placeholder={{
                icon: <CloudUploadOutlined />,
                title: 'Upload File',
                description: 'Drag or click to upload file.',
              }}
            />   
            ) 
          }
        }
      </SemanticPreview>
      <SemanticPreview semantics={[
            { name: 'list', desc: '列表容器' },
            { name: 'item', desc: '列表项' },
          ]}
        >
        {({ classNames }) => {
          return (
            <Attachments classNames={classNames} items={items} />     
          ) 
          }
        }
      </SemanticPreview>
    </Flex>
  )
})

</script>
