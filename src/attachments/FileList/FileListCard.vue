<script setup lang="tsx">
import classnames from 'classnames';
import { CloseCircleFilled, FileExcelFilled, FileImageFilled, FileMarkdownFilled, FilePdfFilled, FilePptFilled, FileTextFilled, FileWordFilled, FileZipFilled } from '@ant-design/icons-vue';
import { computed, onWatcherCleanup, useTemplateRef, watch, type VNode } from 'vue';
import AudioIcon from './AudioIcon.vue';
import VideoIcon from './VideoIcon.vue';
import type { FileListCardProps } from '../interface';
import { useAttachmentContextInject } from '../context';
import { useXProviderContext } from '../../x-provider';
import { previewImage } from '../util';
import useStyle from '../style';
import useState from '../../_util/hooks/use-state';
import { Progress, Image } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsFileListCard' });

const EMPTY = '\u00A0';

const DEFAULT_ICON_COLOR = '#8c8c8c';

const IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

const PRESET_FILE_ICONS: {
  ext: string[];
  color: string;
  icon: VNode;
}[] = [
    {
      icon: <FileExcelFilled />,
      color: '#22b35e',
      ext: ['xlsx', 'xls'],
    },
    {
      icon: <FileImageFilled />,
      color: DEFAULT_ICON_COLOR,
      ext: IMG_EXTS,
    },
    {
      icon: <FileMarkdownFilled />,
      color: DEFAULT_ICON_COLOR,
      ext: ['md', 'mdx'],
    },
    {
      icon: <FilePdfFilled />,
      color: '#ff4d4f',
      ext: ['pdf'],
    },
    {
      icon: <FilePptFilled />,
      color: '#ff6e31',
      ext: ['ppt', 'pptx'],
    },
    {
      icon: <FileWordFilled />,
      color: '#1677ff',
      ext: ['doc', 'docx'],
    },
    {
      icon: <FileZipFilled />,
      color: '#fab714',
      ext: ['zip', 'rar', '7z', 'tar', 'gz'],
    },
    {
      icon: <VideoIcon />,
      color: '#ff4d4f',
      ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    },
    {
      icon: <AudioIcon />,
      color: '#8c8c8c',
      ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
    },
  ];

function matchExt(suffix: string, ext: string[]) {
  return ext.some((e) => suffix.toLowerCase() === `.${e}`);
}

function getSize(size: number) {
  let retSize = size;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let unitIndex = 0;

  while (retSize >= 1024 && unitIndex < units.length - 1) {
    retSize /= 1024;
    unitIndex++;
  }

  return `${retSize.toFixed(0)} ${units[unitIndex]}`;
}

const { prefixCls: customizePrefixCls, item, onRemove, className, style, imageProps } = defineProps<FileListCardProps>();

const context = useAttachmentContextInject();
const disabled = computed(() => context.value.disabled);

const name = computed(() => item.name);
const size = computed(() => item.size);
const percent = computed(() => item.percent);
const status = computed(() => item.status || 'done');
const description = computed(() => item.description);

// ============================= Prefix =============================
const { getPrefixCls } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('attachment', customizePrefixCls));
const cardCls = `${prefixCls.value}-list-card`;

// ============================= Style ==============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================= Ref =============================
const containerRef = useTemplateRef<HTMLDivElement>('file-list-card-container');

// ============================== Name ==============================
const nameState = computed(() => {
  const nameStr = name.value || '';
  const match = nameStr.match(/^(.*)\.[^.]+$/);
  return {
    namePrefix: match ? match[1] : nameStr,
    nameSuffix: match ? nameStr.slice(match[1].length) : ''
  }
});

const isImg = computed(() => matchExt(nameState.value.nameSuffix, IMG_EXTS));

// ============================== Desc ==============================
const desc = computed(() => {
  if (description.value) {
    return description.value;
  }

  if (status.value === 'uploading') {
    return `${percent.value || 0}%`;
  }

  if (status.value === 'error') {
    return item.response || EMPTY;
  }

  return size.value ? getSize(size.value) : EMPTY;
});

// ============================== Icon ==============================
const iconState = computed(() => {
  for (const { ext, icon, color } of PRESET_FILE_ICONS) {
    if (matchExt(nameState.value.nameSuffix, ext)) {
      return {
        icon,
        iconColor: color
      }
    }
  }

  return {
    icon: <FileTextFilled key="defaultIcon" />,
    iconColor: DEFAULT_ICON_COLOR
  }
});

// ========================== ImagePreview ==========================
const [previewImg, setPreviewImg] = useState<string>();

watch(() => item.originFileObj, () => {
  if (item.originFileObj) {
    let synced = true;
    previewImage(item.originFileObj).then((url) => {
      if (synced) {
        setPreviewImg(url);
      }
    });

    onWatcherCleanup(() => {
      synced = false;
    });
  }
  setPreviewImg(undefined);
}, { immediate: true });

// ============================= Render =============================
const previewUrl = computed(() => item.thumbUrl || item.url || previewImg.value);
const isImgPreview = computed(() => isImg.value && (item.originFileObj || previewUrl.value));
const content = computed(() => {
  if (isImgPreview.value) {
    // Preview Image style
    return (
      <>
        {previewUrl.value && (
          <Image
            {...imageProps}
            // TODO antdv type error
            // @ts-expect-error
            alt="preview"
            src={previewUrl.value}
          />
        )}

        {status.value !== 'done' && (
          <div class={`${cardCls}-img-mask`}>
            {status.value === 'uploading' && percent.value !== undefined && (
              <Progress percent={percent.value} prefixCls={cardCls} />
            )}
            {status.value === 'error' && (
              <div class={`${cardCls}-desc`}>
                <div class={`${cardCls}-ellipsis-prefix`}>{desc.value}</div>
              </div>
            )}
          </div>
        )}
      </>
    )
  }
  // Preview Card style
  return (
    <>
      <div class={`${cardCls}-icon`} style={{ color: iconState.value.iconColor }}>
        {iconState.value.icon}
      </div>
      <div class={`${cardCls}-content`}>
        <div class={`${cardCls}-name`}>
          <div class={`${cardCls}-ellipsis-prefix`}>{nameState.value.namePrefix ?? EMPTY}</div>
          <div class={`${cardCls}-ellipsis-suffix`}>{nameState.value.nameSuffix}</div>
        </div>
        <div class={`${cardCls}-desc`}>
          <div class={`${cardCls}-ellipsis-prefix`}>{desc.value}</div>
        </div>
      </div>
    </>
  );
});

defineExpose({
  nativeElement: containerRef
});

defineRender(() => {
  return wrapCSSVar(
    <div
      class={classnames(
        cardCls,
        {
          [`${cardCls}-status-${status.value}`]: status.value,
          [`${cardCls}-type-preview`]: isImgPreview.value,
          [`${cardCls}-type-overview`]: !isImgPreview.value,
        },
        className,
        hashId.value,
        cssVarCls,
      )}
      style={style}
      ref="file-list-card-container"
    >
      {content.value}

      {/* Remove Icon */}
      {!disabled.value && onRemove && (
        <button
          type="button"
          class={`${cardCls}-remove`}
          onClick={() => {
            onRemove(item);
          }}
        >
          <CloseCircleFilled />
        </button>
      )}
    </div>
  )
});
</script>
