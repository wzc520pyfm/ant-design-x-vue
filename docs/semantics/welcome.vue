<script setup lang="tsx">
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'
import { Welcome } from 'ant-design-x-vue'
import { Button, Space } from 'ant-design-vue';
import {ShareAltOutlined, EllipsisOutlined} from '@ant-design/icons-vue'

defineRender(() => {
  return (
    <SemanticPreview semantics={[
        { name: 'icon', desc: '图标容器' },
        { name: 'title', desc: '标题容器' },
        { name: 'description', desc: '描述容器' },
        { name: 'extra', desc: '额外内容' },
      ]}
    >
     {({ classNames }) => {
       return (
        <Welcome
          classNames={classNames}
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="Hello, I'm Ant Design X"
          description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
          extra={
            <Space>
              <Button size="small" icon={<ShareAltOutlined />} />
              <Button size="small" icon={<EllipsisOutlined />} />
            </Space>
          }
        ></Welcome>
       ) 
      }
     }
  </SemanticPreview>
  )
})

</script>
