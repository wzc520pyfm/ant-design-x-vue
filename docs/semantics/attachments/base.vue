<script setup lang="tsx">
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue'

const {classNames} = defineProps<{
  classNames: Record<string, string>
}>()

const items: AttachmentsProps['items'] = Array.from({ length: 3 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

defineRender(() => {
  return (
    <Attachments classNames={classNames} items={items} />     
  )
})

</script>
