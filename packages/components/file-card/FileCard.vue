<script setup lang="tsx">
import {
  FileExcelFilled,
  FileImageFilled,
  FileMarkdownFilled,
  FilePdfFilled,
  FilePptFilled,
  FileTextFilled,
  FileWordFilled,
  FileZipFilled,
  CodeSandboxOutlined,
  // JavaOutlined,
  // JavaScriptOutlined,
  // PythonOutlined,
} from '@ant-design/icons-vue';
import { Image } from 'ant-design-vue';
import type { ImageProps } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, useAttrs, useTemplateRef } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import File from './components/File.vue';
import ImageLoading from './components/ImageLoading.vue';
import AudioIcon from './icons/audio.vue';
import VideoIcon from './icons/video.vue';
import useStyle from './style';
import { matchExt } from './utils';
import type { FileCardProps } from './interface';

defineOptions({
  name: 'AXFileCard',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FileCardProps>(), {
  styles: () => ({}),
  classNames: () => ({}),
});

const attrs = useAttrs();
const rootRef = useTemplateRef<HTMLDivElement>('rootRef');

defineExpose({ nativeElement: rootRef });

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('file-card', props.prefixCls));
const contextConfig = useXComponentConfig('fileCard');

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.class,
    props.rootClassName,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'jfif'];
const AUDIO_EXT = ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'];
const VIDEO_EXT = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];

const PRESET_FILE_ICONS = [
  { icon: <FileExcelFilled />, color: '#22b35e', ext: ['xlsx', 'xls'], key: 'excel' },
  { icon: <FileImageFilled />, color: '#8c8c8c', ext: IMAGE_EXT, key: 'image' },
  { icon: <FileMarkdownFilled />, color: '#8c8c8c', ext: ['md', 'mdx'], key: 'markdown' },
  { icon: <FilePdfFilled />, color: '#ff4d4f', ext: ['pdf'], key: 'pdf' },
  { icon: <FilePptFilled />, color: '#ff6e31', ext: ['ppt', 'pptx'], key: 'ppt' },
  { icon: <FileWordFilled />, color: '#1677ff', ext: ['doc', 'docx'], key: 'word' },
  { icon: <FileZipFilled />, color: '#fab714', ext: ['zip', 'rar', '7z', 'tar', 'gz'], key: 'zip' },
  { icon: <VideoIcon />, color: '#ff4d4f', ext: VIDEO_EXT, key: 'video' },
  { icon: <AudioIcon />, color: '#ff6e31', ext: AUDIO_EXT, key: 'audio' },
  { icon: <CodeSandboxOutlined />, color: '#1677ff', ext: ['java'], key: 'java' },
  { icon: <CodeSandboxOutlined />, color: '#fab714', ext: ['js'], key: 'javascript' },
  { icon: <CodeSandboxOutlined />, color: '#fab714', ext: ['py'], key: 'python' },
];

const DEFAULT_ICON = { icon: <FileTextFilled />, color: '#8c8c8c', ext: ['default'], key: 'default' };

const nameParts = computed(() => {
  const nameStr = props.name || '';
  const match = nameStr.match(/^(.*)\.[^.]+$/);
  return match ? [match[1], nameStr.slice(match[1].length)] as const : [nameStr, ''] as const;
});

const namePrefix = computed(() => nameParts.value[0]);
const nameSuffix = computed(() => nameParts.value[1]);

const iconInfo = computed(() => {
  if (typeof props.icon === 'string') {
    const match = PRESET_FILE_ICONS.find((item) => item.key === props.icon);
    if (match) {
      return [match.icon, match.color] as const;
    }
  }
  for (const item of PRESET_FILE_ICONS) {
    if (matchExt(nameSuffix.value, item.ext)) {
      return [item.icon, item.color] as const;
    }
  }
  return [DEFAULT_ICON.icon, DEFAULT_ICON.color] as const;
});

const fileType = computed(() => {
  if (props.type) {
    return props.type;
  }
  if (matchExt(nameSuffix.value, IMAGE_EXT)) {
    return 'image';
  }
  if (matchExt(nameSuffix.value, AUDIO_EXT)) {
    return 'audio';
  }
  if (matchExt(nameSuffix.value, VIDEO_EXT)) {
    return 'video';
  }
  return 'file';
});

const domProps = computed(() =>
  pickAttrs(attrs, { attr: true, aria: true, data: true }),
);

defineRender(() => {
  const styles = props.styles;
  const classNamesVal = props.classNames;

  let ContentNode = null;

  if (fileType.value === 'image') {
    const preview = props.mask ? { mask: props.mask } : undefined;
    ContentNode = (
      <div
        class={classnames(`${prefixCls.value}-image`, classNamesVal.file, {
          [`${prefixCls.value}-loading`]: props.loading,
        })}
        style={styles.file}
      >
        {props.src && (
          <Image
            rootClassName={classnames(`${prefixCls.value}-image-img`)}
            width={styles?.file?.width}
            height={styles?.file?.height}
            alt={props.name}
            src={props.src}
            preview={preview}
            {...(props.imageProps as ImageProps)}
          />
        )}
        {props.loading && (
          <ImageLoading spinProps={props.spinProps} prefixCls={prefixCls.value} style={styles.file} />
        )}
      </div>
    );
  } else if (fileType.value === 'video') {
    ContentNode = (
      <video
        src={props.src}
        controls
        style={styles.file}
        class={classnames(`${prefixCls.value}-video`, classNamesVal.file)}
        {...props.videoProps}
      />
    );
  } else if (fileType.value === 'audio') {
    ContentNode = (
      <audio
        src={props.src}
        controls
        style={styles.file}
        class={classnames(`${prefixCls.value}-audio`, classNamesVal.file)}
        {...props.audioProps}
      />
    );
  } else {
    ContentNode = (
      <File
        prefixCls={prefixCls.value}
        name={namePrefix.value}
        ext={nameSuffix.value}
        size={props.size}
        byte={props.byte}
        description={props.description}
        icon={props.icon && typeof props.icon !== 'string' ? props.icon : iconInfo.value[0]}
        iconColor={iconInfo.value[1]}
        onClick={props.onClick}
        mask={props.mask}
        classNames={classNamesVal}
        styles={styles}
      />
    );
  }

  return wrapCSSVar(
    <div
      {...domProps.value}
      ref="rootRef"
      class={mergedCls.value}
      style={{
        ...contextConfig.value.style,
        ...props.style,
        ...styles.root,
      }}
    >
      {ContentNode}
    </div>,
  );
});
</script>
