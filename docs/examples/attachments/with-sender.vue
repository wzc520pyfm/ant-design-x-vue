<script setup lang="tsx">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Badge, type UploadProps } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, onUnmounted, ref } from 'vue';

defineOptions({ name: 'AXAttachmentWithSender' });

type FileType = Parameters<UploadProps['beforeUpload']>[0];

const open = ref(true);
const items = ref([]);
const text = ref('');

const senderRef = ref<InstanceType<typeof Sender>>(null);

onUnmounted(() => {
  // Clear all created object URLs when the component is unmounted
  items.value.forEach(item => {
    if (item.url?.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }
  });
});

const Demo = () => {
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
        // Mock not real upload file
        beforeUpload={() => false}
        items={items.value}
        onChange={({ file, fileList }) => {
          if (file.status === 'removed') {
            items.value = fileList;
            return;
          }
          file.url = window.URL.createObjectURL(file as FileType)
          // file.thumbUrl = URL of the thumbnail image
          items.value = fileList.map((item) => {
            if (item.uid === file.uid && file.status !== 'removed' && item.originFileObj) {
              // clear URL
              if (item.url?.startsWith('blob:')) {
                URL.revokeObjectURL(item.url);
              }
              // create new preview URL
              return {
                ...item,
                url: URL.createObjectURL(item.originFileObj),
              };
            }
            return item;
          });
        }}
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

  const badgeNode = computed(() => (
    <Badge dot={items.value.length > 0 && !open.value}>
      <Button onClick={() => open.value = !open.value} icon={<LinkOutlined />} />
    </Badge>
  ))

  return (
    <Flex style={{ minHeight: '250px' }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader.value}
        prefix={
          badgeNode.value
        }
        value={text.value}
        onChange={v => text.value = v}
        onSubmit={() => {
          items.value = []
          text.value = ''
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
  )
});

</script>
