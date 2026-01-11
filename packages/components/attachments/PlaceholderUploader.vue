<script setup lang="tsx">
import classNames from 'classnames';
import type { PlaceholderConfig, PlaceholderProps } from './interface';
import { useAttachmentContextInject } from './context';
import useState from '../_util/hooks/use-state';
import { computed, isVNode, useTemplateRef } from 'vue';
import { Flex, Typography, Upload } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsPlaceholderUploader' });

const {
  prefixCls,
  placeholder = {},
  upload,
  className,
  style
} = defineProps<PlaceholderProps>();

const placeholderCls = `${prefixCls}-placeholder`;

const placeholderConfig = computed(() => (placeholder || {}) as PlaceholderConfig);

const uploadDraggerRef = useTemplateRef<InstanceType<typeof Upload.Dragger>>('upload-dragger');

// has disabled
const attachmentContext = useAttachmentContextInject();

// ============================= Drag =============================
const [dragIn, setDragIn] = useState(false);

const onDragEnter = () => {
  setDragIn(true);
};

const onDragLeave = (e: DragEvent) => {
  // Leave the div should end
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
    setDragIn(false);
  }
};

const onDrop = () => {
  setDragIn(false);
};

const nativeElement = computed<HTMLElement>(() => uploadDraggerRef.value?.$el);

defineExpose({
  nativeElement,
})

const isVNodeArray = (val: any) => Array.isArray(val) && val.every(isVNode);

// ============================ Render ============================
const node = computed(() => {
  if (isVNode(placeholder) || isVNodeArray(placeholder)) {
    return placeholder;
  }
  return (
    <Flex align="center" justify="center" vertical class={`${placeholderCls}-inner`}>
      <Typography.Text
        // @ts-expect-error
        class={`${placeholderCls}-icon`}
      >
        {placeholderConfig.value.icon}
      </Typography.Text>
      <Typography.Title
        // @ts-expect-error
        class={`${placeholderCls}-title`}
        level={5}
      >
        {placeholderConfig.value.title}
      </Typography.Title>
      <Typography.Text
        // @ts-expect-error
        class={`${placeholderCls}-description`}
        type="secondary"
      >
        {placeholderConfig.value.description}
      </Typography.Text>
    </Flex>
  )
});

defineRender(() => {
  return (
    <div
      class={classNames(
        placeholderCls,
        {
          [`${placeholderCls}-drag-in`]: dragIn.value,
          [`${placeholderCls}-disabled`]: attachmentContext.value.disabled,
        },
        className,
      )}
      onDragenter={onDragEnter}
      onDragleave={onDragLeave}
      onDrop={onDrop}
      aria-hidden={attachmentContext.value.disabled}
      style={style}
    >
      <Upload.Dragger
        {...upload}
        showUploadList={false}
        ref="upload-dragger"
        style={{ padding: 0, border: 0, background: 'transparent' }}
      >
        {node.value}
      </Upload.Dragger>
    </div>
  )
});
</script>
