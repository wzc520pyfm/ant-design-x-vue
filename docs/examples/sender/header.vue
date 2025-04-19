<script setup lang="tsx">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, theme, Typography } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXSenderHeader' });

const { token } = theme.useToken();
const open = ref(false);

const Demo = () => {
  const { message } = App.useApp();

  const headerNode = computed(() => (
    <Sender.Header title="Upload Sample" open={open.value} onOpenChange={v => open.value = v}>
      <Flex vertical align="center" gap="small" style={{ marginBlock: token.value.paddingLG }}>
        <CloudUploadOutlined style={{ fontSize: '4em' }} />
        <Typography.Title
          level={5}
          // @ts-expect-error
          style={{ margin: 0 }}
        >
          Drag file here(just demo)
        </Typography.Title>
        <Typography.Text type="secondary" >
          Support pdf, doc, xlsx, ppt, txt, image file types
        </Typography.Text >
        < Button
          onClick={() => {
            message.info('Mock select file');
          }}
        >
          Select File
        </Button>
      </Flex>
    </Sender.Header>
  ));

  return (
    <Flex style={{ height: '350px' }} align="end" >
      <Sender
        header={headerNode.value}
        prefix={
          <Button
            type="text"
            icon={< LinkOutlined />}
            onClick={() => {
              open.value = !open.value
            }}
          />
        }
        placeholder="← Click to open"
        onSubmit={() => {
          message.success('Send message successfully!');
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
