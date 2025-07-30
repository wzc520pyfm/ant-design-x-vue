<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useTemplateRef, type VNode, watch } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import type { Attachment, AttachmentsProps, AttachmentsRef, PlaceholderProps } from './interface';
import PlaceholderUploader from './PlaceholderUploader.vue';
import type { UploadProps } from 'ant-design-vue';
import DropArea from './DropArea.vue';
import SilentUploader from './SilentUploader.vue';
import { FileList } from './FileList';
import useStyle from './style';
import useState from '../_util/hooks/use-state';
import AttachmentContextProvider from './context';

defineOptions({ name: 'AXAttachments' });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  rootStyle,
  className,
  style,
  items = [],
  children,
  getDropContainer,
  placeholder,
  onChange,
  onRemove,
  overflow,
  imageProps,
  disabled,
  classNames = {},
  styles = {},
  ...uploadProps
} = defineProps<AttachmentsProps>();

const slots = defineSlots<{
  placeholder?(props?: { type: 'inline' | 'drop' }): VNode | string;
}>();

// ============================ PrefixCls ============================
const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = getPrefixCls('attachment', customizePrefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('attachments');

const contextClassNames = computed(() => contextConfig.value.classNames);
const contextStyles = computed(() => contextConfig.value.styles);

// ============================= Ref =============================
const containerRef = useTemplateRef<HTMLDivElement>('attachments-container');
// const containerRef = ref<HTMLDivElement>(null);

const placeholderUploaderRef = useTemplateRef<InstanceType<typeof PlaceholderUploader>>('placeholder-uploader');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const cssinjsCls = computed(() => classnames(hashId.value, cssVarCls));

// ============================ Upload ============================
const [fileList, setFileList] = useState(items);
watch(() => items, () => {
  setFileList(items);
});

const triggerChange: AttachmentsProps['onChange'] = (info) => {
  setFileList(info.fileList);
  onChange?.(info);
};

const mergedUploadProps = computed<UploadProps>(() => ({
  ...uploadProps,
  fileList: fileList.value,
  onChange: triggerChange,
}));

const onItemRemove = (item: Attachment) =>
  Promise.resolve(typeof onRemove === 'function' ? onRemove(item) : onRemove).then((ret) => {
    // Prevent removing file
    if (ret === false) {
      return;
    }

    const newFileList = fileList.value.filter((fileItem) => fileItem.uid !== item.uid);
    triggerChange({
      file: { ...item, status: 'removed' },
      fileList: newFileList,
    });
  });

const getPlaceholderNode = (
  type: 'inline' | 'drop',
  props?: Pick<PlaceholderProps, 'style'>,
) => {
  const placeholderContent = slots.placeholder
    ? slots.placeholder({ type })
    : typeof placeholder === 'function'
      ? placeholder(type)
      : placeholder;

  return (
    <PlaceholderUploader
      placeholder={placeholderContent}
      upload={mergedUploadProps.value}
      prefixCls={prefixCls}
      className={classnames(contextClassNames.value.placeholder, classNames.placeholder)}
      style={{
        ...contextStyles.value.placeholder,
        ...styles.placeholder,
        ...props?.style,
      }}
      ref={type === 'inline' ? 'placeholder-uploader' : undefined}
    />
  );
};

const hasFileList = computed(() => fileList.value.length > 0);

defineExpose<AttachmentsRef>({
  nativeElement: containerRef.value,
  upload: (file) => {
    // get native element
    const fileInput = placeholderUploaderRef.value?.nativeElement.querySelector?.('input[type="file"]') as HTMLInputElement;

    if (!fileInput) return;

    const dataTransfer = new DataTransfer();
    try {
      // If length exists, it's a File array or FileList — handle together.
      if ('length' in file && file.length >= 1) {
        for (let i = 0; i < file.length; i++) {
          dataTransfer.items.add(file[i]);
        }
      } else {
        // Single File
        dataTransfer.items.add(file as File);
      }
      fileInput.files = dataTransfer.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {
      console.error('upload failed', err);
    }
  },
});

defineRender(() => {
  return wrapCSSVar(
    <AttachmentContextProvider
      value={{
        disabled,
      }}
    >
      {children ? (
        <>
          <SilentUploader
            upload={mergedUploadProps.value}
            rootClassName={rootClassName}
            ref="attachments-upload"
            // TODO: need support slot alse
            children={children}
          />
          <DropArea
            getDropContainer={getDropContainer}
            prefixCls={prefixCls}
            className={classnames(cssinjsCls.value, rootClassName)}
            // TODO: need support slot alse
            children={getPlaceholderNode('drop')}
          />
        </>
      ) : (
        <div
          class={classnames(
            prefixCls,
            cssinjsCls.value,
            {
              [`${prefixCls}-rtl`]: direction.value === 'rtl',
            },
            className,
            rootClassName,
          )}
          style={{
            ...rootStyle,
            ...style,
          }}
          dir={direction.value || 'ltr'}
          ref="attachments-container"
        >
          <FileList
            prefixCls={prefixCls}
            items={fileList.value}
            onRemove={onItemRemove}
            overflow={overflow}
            upload={mergedUploadProps.value}
            listClassName={classnames(contextClassNames.value.list, classNames.list)}
            listStyle={{
              ...contextStyles.value.list,
              ...styles.list,
              ...(!hasFileList.value && { display: 'none' }),
            }}
            itemClassName={classnames(contextClassNames.value.item, classNames.item)}
            itemStyle={{
              ...contextStyles.value.item,
              ...styles.item,
            }}
            imageProps={imageProps}
          />
          {getPlaceholderNode('inline', hasFileList.value ? { style: { display: 'none' } } : {})}
          <DropArea
            getDropContainer={getDropContainer || (() => containerRef.value)}
            prefixCls={prefixCls}
            className={cssinjsCls.value}
            children={getPlaceholderNode('drop')}
          />
        </div>
      )}
    </AttachmentContextProvider>,
  );
});
</script>
