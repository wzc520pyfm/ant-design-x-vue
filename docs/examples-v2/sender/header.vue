<script setup lang="tsx">
defineOptions({ name: 'AXSenderHeaderV2' });

import { Sender } from 'ant-design-x-vue';
import { Button, Flex, Typography, message, theme } from 'ant-design-vue';
import { CloudUploadOutlined, PaperClipOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const open = ref(false);
const { token } = theme.useToken();

defineRender(() => {
  const headerNode = (
    <Sender.Header title="Upload Sample" open={open.value} onOpenChange={(v) => { open.value = v; }}>
      <Flex vertical align="center" gap="small" style={{ marginBlock: `${token.value.paddingLG}px` }}>
        <CloudUploadOutlined style={{ fontSize: '4em' }} />
        <Typography.Title level={5} style={{ margin: 0 }}>
          Drag file here (just demo)
        </Typography.Title>
        <Typography.Text type="secondary">
          Support pdf, doc, xlsx, ppt, txt, image file types
        </Typography.Text>
        <Button onClick={() => { message.info('Mock select file'); }}>
          Select File
        </Button>
      </Flex>
    </Sender.Header>
  );

  return (
    <Flex style={{ height: '350px' }} align="end">
      <Sender
        header={headerNode}
        prefix={
          <Button
            type="text"
            style={{ fontSize: '16px' }}
            onClick={() => { open.value = !open.value; }}
          >
            {{ icon: () => <PaperClipOutlined /> }}
          </Button>
        }
        placeholder="← Click to open"
        onSubmit={() => { message.success('Send message successfully!'); }}
      />
    </Flex>
  );
});
</script>
