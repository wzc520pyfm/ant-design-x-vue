<script setup lang="tsx">
import { Empty, Flex, Spin } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, type CSSProperties, type VNode } from 'vue';
import { Actions } from '../actions';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import type { FolderProps, FolderTreeData } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXFolderFilePreview', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    prefixCls?: string;
    style?: CSSProperties;
    classNames?: FolderProps['classNames'];
    styles?: FolderProps['styles'];
    selectedFile?: string[] | null;
    previewRender?: FolderProps['previewRender'];
    fileContent?: string;
    loading?: boolean;
    previewTitle?: FolderProps['previewTitle'];
    getFileNode?: (
      path: string[],
    ) => { title: FolderTreeData['title']; path: string; content?: string } | undefined;
    emptyRender?: FolderProps['emptyRender'];
  }>(),
  {
    fileContent: '',
    loading: false,
    selectedFile: () => [],
  },
);

const [contextLocale] = useLocale('Folder', () => enUS.Folder!);
const { getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('folder', props.prefixCls));
const contextConfig = useXComponentConfig('folder');
const previewCls = computed(() => `${prefixCls.value}-preview`);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const getFileExtension = (path = '') => {
  const parts = path.split('.');
  return parts[parts.length - 1] || '';
};

const getLanguageFromExtension = (ext: string) => ext.toLowerCase() || 'txt';

const originContentNode = (content: string, language: string): VNode => (
  <pre class={`${previewCls.value}-code`} data-language={language}>
    <code>{content.replace(/\n$/, '')}</code>
  </pre>
);

defineRender(() => {
  const cls = prefixCls.value;
  const pCls = previewCls.value;
  const selectedFile = props.selectedFile;
  const fileContent = props.fileContent || '';

  let body: VNode | null = null;

  if (props.loading) {
    body = (
      <div class={classnames(`${pCls}-loading-container`, props.classNames?.previewRender)}>
        <Spin />
      </div>
    );
  } else if (!selectedFile || selectedFile.length === 0) {
    if (props.emptyRender === false || props.emptyRender === null) {
      body = null;
    } else {
      const emptyNode =
        typeof props.emptyRender === 'function'
          ? props.emptyRender()
          : props.emptyRender || (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={contextLocale.value.selectFile}
              />
            );
      body = (
        <div class={classnames(`${pCls}-empty-container`, props.classNames?.previewRender)}>
          {emptyNode}
        </div>
      );
    }
  } else {
    const fileNode = props.getFileNode?.(selectedFile);
    const title = fileNode?.title || selectedFile[selectedFile.length - 1];
    const path = selectedFile;
    const fileName = selectedFile[selectedFile.length - 1];
    const extension = getFileExtension(fileName);
    const language = getLanguageFromExtension(extension);

    let headerNode: VNode | string | null;
    if (props.previewTitle === false || props.previewTitle === null) {
      headerNode = null;
    } else if (props.previewTitle) {
      headerNode =
        typeof props.previewTitle === 'function'
          ? props.previewTitle({ title, path, content: fileContent })
          : props.previewTitle;
    } else {
      headerNode = (
        <Flex justify="space-between" align="center" class={`${pCls}-title`}>
          <span class={`${pCls}-filename`}>{title}</span>
          <Actions.Copy text={fileContent} className={`${pCls}-copy`} />
        </Flex>
      );
    }

    const origin = originContentNode(fileContent, language);
    let contentNode: VNode | string | null;
    if (props.previewRender) {
      if (typeof props.previewRender === 'function') {
        contentNode = props.previewRender(
          {
            content: fileContent,
            path: selectedFile,
            title: fileNode?.title,
            language,
          },
          { originNode: origin },
        );
      } else {
        contentNode = props.previewRender;
      }
    } else {
      contentNode = origin;
    }

    body = (
      <>
        {headerNode ? (
          <div class={classnames(`${pCls}-title-wrapper`, props.classNames?.previewTitle)}>
            {headerNode}
          </div>
        ) : null}
        <div class={classnames(`${pCls}-content`, props.classNames?.previewRender)}>
          {contentNode}
        </div>
      </>
    );
  }

  return wrapCSSVar(
    <div
      class={classnames(
        `${cls}-preview`,
        props.classNames?.filePreview,
        hashId.value,
        cssVarCls,
      )}
      style={{
        ...contextConfig.value.styles?.filePreview,
        ...props.styles?.filePreview,
        ...props.style,
      }}
    >
      {body}
    </div>,
  );
});
</script>
