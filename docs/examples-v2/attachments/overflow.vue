<script setup lang="tsx">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { Flex, Segmented, Switch } from 'ant-design-vue';
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXAttachmentOverflow' });

const presetFiles: AttachmentsProps['items'] = Array.from({ length: 30 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

const overflow = ref<AttachmentsProps['overflow']>('wrap');
const items = ref<AttachmentsProps['items']>(presetFiles);
const disabled = ref(false);

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" align="center">
        <Segmented
          options={[
            { value: 'wrap', label: 'Wrap' },
            { value: 'scrollX', label: 'Scroll X' },
            { value: 'scrollY', label: 'Scroll Y' },
          ]}
          value={overflow.value}
          onChange={(v) => {
            overflow.value = v as AttachmentsProps['overflow'];
          }}
          style={{ marginInlineEnd: 'auto' }}
        />
        <Switch
          checked={items.value.length !== 0}
          onChange={() => {
            items.value = items.value.length ? [] : presetFiles
          }}
          checkedChildren="Data"
          unCheckedChildren="Data"
        />
        <Switch
          checked={disabled.value}
          onChange={(v) => {
            disabled.value = v as boolean;
          }}
          checkedChildren="Disabled"
          unCheckedChildren="Disabled"
        />
      </Flex>
      <Attachments
        overflow={overflow.value}
        items={items.value}
        onChange={(info) => {
          items.value = info.fileList
        }}
        beforeUpload={() => false}
        placeholder={{
          icon: <CloudUploadOutlined />,
          title: 'Click or Drop files here',
          description: 'Support file type: image, video, audio, document, etc.',
        }}
        disabled={disabled.value}
      />
    </Flex>
  )
})
</script>
