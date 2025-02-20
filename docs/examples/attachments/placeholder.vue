<script setup lang="tsx">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Result, theme } from 'ant-design-vue';
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue';
import { computed, type CSSProperties, ref } from 'vue';

defineOptions({ name: 'AXAttachmentPlaceholder' });

const presetFiles: AttachmentsProps['items'] = [
  {
    uid: '1',
    name: 'uploading file.xlsx',
    status: 'uploading',
    url: 'http://www.baidu.com/xxx.png',
    percent: 93,
  },
  {
    uid: '2',
    name: 'uploaded file.docx',
    status: 'done',
    size: 123456,
    description: 'Customize description',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'upload error with long text file name.zip',
    status: 'error',
    response: 'Server Error 500', // custom error message to show
    url: 'http://www.baidu.com/zzz.png',
  },
  {
    uid: '4',
    name: 'image uploading preview.png',
    status: 'uploading',
    percent: 33,
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '5',
    name: 'image done preview.png',
    status: 'done',
    size: 123456,
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '6',
    name: 'image error preview.png',
    status: 'error',
    response: 'Server Error 500', // custom error message to show
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

type ExtractFunc<T> = T extends (...args: any) => any ? T : never;

const getPlaceholderFn = (
  inlinePlaceholder: ReturnType<ExtractFunc<AttachmentsProps['placeholder']>>,
) => {
  return (type: 'inline' | 'drop') =>
    type === 'drop'
      ? {
        title: 'Drop file here',
      }
      : inlinePlaceholder;
};

const { token } = theme.useToken();
const items = ref<AttachmentsProps['items']>([]);

const sharedBorderStyle = computed<CSSProperties>(() => ({
  borderRadius: token.value.borderRadius,
  overflow: 'hidden',
  background: token.value.colorBgContainer,
}));

const sharedAttachmentProps = computed<AttachmentsProps>(() => ({
  beforeUpload: () => false,
  items: items.value,
  onChange: ({ fileList }) => {
    console.log('onChange:', fileList);
    items.value = fileList;
  },
}));

defineRender(() => {
  return (
    <Flex
      vertical
      gap="middle"
      style={{
        padding: token.value.padding,
        background: token.value.colorBgContainerDisabled,
      }}
    >
      <div style={sharedBorderStyle.value}>
        <Attachments
          {...sharedAttachmentProps.value}
          placeholder={getPlaceholderFn({
            icon: <CloudUploadOutlined />,
            title: 'Click or Drop files here',
            description: 'Support file type: image, video, audio, document, etc.',
          })}
        />
      </div>

      <div style={sharedBorderStyle.value}>
        <Attachments
          {...sharedAttachmentProps.value}
          placeholder={getPlaceholderFn(
            <Result
              title="Custom Placeholder Node"
              icon={<CloudUploadOutlined />}
              extra={<Button type="primary">Do Upload</Button>}
              style={{ padding: 0 }}
            />,
          )}
        />
      </div>

      <Flex gap="middle">
        <Button
          style={{ flex: '1 1 50%' }}
          disabled={!!items.value.length}
          type="primary"
          onClick={() => {
            items.value = presetFiles
          }}
        >
          Fill Files
        </Button>
        <Button
          style={{ flex: '1 1 50%' }}
          disabled={!items.value.length}
          onClick={() => {
            items.value = []
          }}
        >
          Reset Files
        </Button>
      </Flex>
    </Flex>
  )
});
</script>
