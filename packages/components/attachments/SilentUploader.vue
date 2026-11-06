<script setup lang="tsx">
import { computed, ref } from 'vue';
import type { SilentUploaderProps } from './interface';
import { Upload } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsSilentUploader' });

const { children, upload, rootClassName } = defineProps<SilentUploaderProps>();

const uploadRef = ref<InstanceType<typeof Upload> | null>(null);

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
      ref={uploadRef}
    >
      {children}
    </Upload>
  )
});
</script>
