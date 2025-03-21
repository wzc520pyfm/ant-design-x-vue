<script setup lang="tsx">
import { ref, useTemplateRef } from 'vue';
import type { SilentUploaderProps } from './interface';
import { Upload } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsSilentUploader' });

const { children, upload, rootClassName } = defineProps<SilentUploaderProps>();

const uploadRef = useTemplateRef<InstanceType<typeof Upload>>('upload');
// const uploadRef = ref<InstanceType<typeof Upload>>(null);

defineExpose({
  nativeElement: uploadRef
});

/**
 * SilentUploader is only wrap children with antd Upload component.
 */
defineRender(() => {
  return (
    <Upload
      {...upload}
      showUploadList={false}
      // rootClassName={rootClassName}
      ref="upload"
    >
      {children}
    </Upload>
  )
});
</script>
