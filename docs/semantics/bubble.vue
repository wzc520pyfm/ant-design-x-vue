<script setup lang="tsx">
import {
  AntDesignOutlined,
  CopyOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { Bubble } from 'ant-design-x-vue'
import { Avatar, Button, Divider, Flex, Space, theme } from 'ant-design-vue'
import { computed } from 'vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticBubble' })

const { token } = theme.useToken()

const listRole = computed(() => ({
  ai: {
    typing: true,
    header: 'AI',
    extra: <Button type="text" size="small" icon={<CopyOutlined />} />,
    avatar: () => <Avatar icon={<AntDesignOutlined />} />,
    footer: (
      <Space size={token.paddingXXS}>
        <Button type="text" size="small" icon={<SyncOutlined />} />
      </Space>
    ),
  },
  user: () => ({
    placement: 'end',
  }),
}))

defineRender(() => {
  return (
    <Flex vertical>
      <SemanticPreview
        semantics={[
          { name: 'root', desc: '气泡根节点' },
          { name: 'body', desc: '主体容器' },
          { name: 'avatar', desc: '头像的外层容器' },
          { name: 'header', desc: '头部的容器' },
          { name: 'content', desc: '聊天内容的容器' },
          { name: 'footer', desc: '底部的容器' },
          { name: 'extra', desc: '气泡尾边栏容器' },
        ]}
      >
        {({ classNames }) => (
          <Bubble
            classNames={classNames}
            content="Feel free to use Ant Design Vue !"
            avatar={<Avatar size={32} icon={<UserOutlined />} />}
            header="Ant Design X Vue"
            extra={<Button type="text" size="small" icon={<CopyOutlined />} />}
            footer={
              <Space size={token.paddingXXS}>
                <Button type="text" size="small" icon={<SyncOutlined />} />
              </Space>
            }
          />
        )}
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      <SemanticPreview
        semantics={[
          { name: 'root', desc: '系统气泡根节点' },
          { name: 'body', desc: '主体容器' },
          { name: 'content', desc: '内容容器' },
        ]}
      >
        {({ classNames }) => (
          <Bubble.System classNames={classNames} content="System message" />
        )}
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      <SemanticPreview
        semantics={[
          { name: 'root', desc: '分隔符根节点' },
          { name: 'body', desc: '主体容器' },
          { name: 'content', desc: '内容容器' },
        ]}
      >
        {({ classNames }) => (
          <Bubble.Divider classNames={classNames} content="Divider" />
        )}
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      <SemanticPreview
        height={420}
        semantics={[
          { name: 'root', desc: '对话列表根节点' },
          { name: 'scroll', desc: '对话列表滚动容器' },
          { name: 'bubble', desc: '对话气泡容器' },
          { name: 'body', desc: '对话气泡的主体容器' },
          { name: 'avatar', desc: '对话气泡的头像外层容器' },
          { name: 'header', desc: '对话气泡的头部容器' },
          { name: 'content', desc: '对话气泡的聊天内容容器' },
          { name: 'footer', desc: '对话气泡的底部容器' },
          { name: 'extra', desc: '对话气泡的尾边栏容器' },
          { name: 'system', desc: '系统气泡容器' },
          { name: 'divider', desc: '分割线气泡容器' },
        ]}
      >
        {({ classNames }) => (
          <Bubble.List
            classNames={classNames}
            style={{ height: 360, width: '100%' }}
            role={listRole.value}
            items={[
              { role: 'system', content: 'Welcome to Ant Design X Vue', key: 'system' },
              { role: 'user', content: 'hello, Ant Design X Vue', key: 'user' },
              { role: 'divider', content: 'divider', key: 'divider' },
              { role: 'ai', content: 'Hello, nice to meet you!', key: 'ai' },
            ]}
          />
        )}
      </SemanticPreview>
    </Flex>
  )
})
</script>
