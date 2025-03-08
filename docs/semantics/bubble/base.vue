<script setup lang="tsx">
import { Bubble, type BubbleProps } from 'ant-design-x-vue'
import { Button, Space, Avatar, theme } from 'ant-design-vue';
import {UserOutlined, SyncOutlined, CopyOutlined } from '@ant-design/icons-vue'

const {classNames} = defineProps<{
  classNames: BubbleProps['classNames']
}>()

const { token } = theme.useToken()

defineRender(() => {
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
})

</script>
