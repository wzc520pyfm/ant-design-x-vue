<script setup lang="tsx">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXSenderPasteImage' });

const Demo = () => {
  const open = ref(false);
  const items = ref([]);
  const text = ref('');

  const attachmentsRef = ref<InstanceType<typeof Attachments>>(null);
  const senderRef = ref<InstanceType<typeof Sender>>(null);

  const senderHeader = computed(() => (
    <Sender.Header
      title="Attachments"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={open.value}
      onOpenChange={v => open.value = v}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        // Mock not real upload file
        beforeUpload={() => false}
        items={items.value}
        onChange={({ fileList }) => items.value = fileList}
        placeholder={(type) =>
          type === 'drop'
            ? {
              title: 'Drop file here',
            }
            : {
              icon: <CloudUploadOutlined />,
              title: 'Upload files',
              description: 'Click or drag files to this area to upload',
            }
        }
        getDropContainer={() => senderRef.value?.nativeElement}
      />
    </Sender.Header>
  ));

  return (
    <Flex style={{ height: '220px' }} align="end">
      <Sender
        ref={senderRef}
        header={senderHeader.value}
        prefix={
          <Button
            type="text"
            icon={<LinkOutlined />}
            onClick={() => {
              open.value = !open.value;
            }}
          />
        }
        value={text.value}
        onChange={v => text.value = v}
        onPasteFile={(_, files) => {
          attachmentsRef.value?.upload(files);
          open.value = true;
        }}
        onSubmit={() => {
          items.value = [];
          text.value = '';
        }}
      />
    </Flex>
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  );
});
</script>
