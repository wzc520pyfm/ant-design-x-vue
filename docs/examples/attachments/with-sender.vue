<script setup lang="tsx">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Badge } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXAttachmentWithSender' });

const Demo = () => {
  const open = ref(true);
  const items = ref([]);
  const text = ref('');

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

  const badgeNode = computed(() => (
    <Badge dot={items.value.length > 0 && !open.value}>
      <Button onClick={() => open.value = !open.value} icon={<LinkOutlined />} />
    </Badge>
  ))

  return (
    <Flex style={{ minHeight: 250 }} align="flex-end">
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