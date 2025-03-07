<script setup lang="tsx">
import { Welcome } from 'ant-design-x-vue'
import { Button, Space } from 'ant-design-vue';
import {ShareAltOutlined, EllipsisOutlined} from '@ant-design/icons-vue'

const {classNames} = defineProps<{
  classNames: Record<string, string>
}>()

defineRender(() => {
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
})

</script>
