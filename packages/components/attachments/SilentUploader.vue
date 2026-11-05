<script setup lang="tsx">
import { computed, useTemplateRef } from 'vue';
import type { SilentUploaderProps } from './interface';
import { Upload } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsSilentUploader' });

const { children, upload, rootClassName } = defineProps<SilentUploaderProps>();

const uploadRef = useTemplateRef<InstanceType<typeof Upload>>('upload');
// const uploadRef = ref<InstanceType<typeof Upload>>(null);

const nativeElement = computed<HTMLElement>(() => uploadRef.value?.$el);

defineExpose({
  nativeElement,
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
