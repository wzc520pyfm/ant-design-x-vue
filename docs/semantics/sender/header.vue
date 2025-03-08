<script setup lang="tsx">
import { Sender } from 'ant-design-x-vue'
import { type SenderHeaderProps } from 'ant-design-x-vue/sender/interface'

const {classNames} = defineProps<{
  classNames: SenderHeaderProps['classNames']
}>()

defineRender(() => {
  return (
    <Sender
      header={
        <Sender.Header open title="Header" classNames={classNames}>
          Content
        </Sender.Header>
      }
    />
  )
})

</script>
