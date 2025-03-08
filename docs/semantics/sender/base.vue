<script setup lang="tsx">
import { Sender, type SenderProps } from 'ant-design-x-vue'
import { Button } from 'ant-design-vue';
import {SmileOutlined} from '@ant-design/icons-vue'

const {classNames} = defineProps<{
  classNames: SenderProps['classNames']
}>()

defineRender(() => {
  return (
    <Sender classNames={classNames} prefix={<Button type="text" icon={<SmileOutlined />} />} />
  )
})

</script>
