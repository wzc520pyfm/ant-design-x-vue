<script setup lang="tsx">
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue'
import {CloudUploadOutlined} from '@ant-design/icons-vue'

const {classNames} = defineProps<{
  classNames: AttachmentsProps['classNames']
}>()

defineRender(() => {
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
})

</script>
