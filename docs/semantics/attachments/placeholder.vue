<script setup lang="tsx">
import { Attachments } from 'ant-design-x-vue'
import {CloudUploadOutlined} from '@ant-design/icons-vue'

const {classNames} = defineProps<{
  classNames: Record<string, string>
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
