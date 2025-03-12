<script setup lang="tsx">
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'
import { Bubble } from 'ant-design-x-vue'
import { Button, Space, Avatar, theme } from 'ant-design-vue';
import {UserOutlined, SyncOutlined, CopyOutlined} from '@ant-design/icons-vue'

const { token } = theme.useToken()

defineRender(() => {
  return (
    <SemanticPreview semantics={[
        { name: 'avatar', desc: '头像的外层容器' },
        { name: 'header', desc: '头部的容器' },
        { name: 'content', desc: '聊天内容的容器' },
        { name: 'footer', desc: '底部的容器' },
      ]}
    >
     {({ classNames }) => {
       return (
        <Bubble
          classNames={classNames}
          content="Feel free to use Ant Design Vue !"
          avatar={<Avatar size={32} icon={<UserOutlined />} />}
          header="Ant Design X Vue"
          footer={
            <Space size={token.paddingXXS}>
              <Button type="default" size="small" icon={<SyncOutlined />} />
              <Button type="default" size="small" icon={<CopyOutlined />} />
            </Space>
          }
        />
       ) 
      }
     }
  </SemanticPreview>
  )
})

</script>
