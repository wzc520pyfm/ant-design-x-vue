<script setup lang="tsx">
import { EnterOutlined } from '@ant-design/icons-vue';
import { App, Flex, Space, Switch, Typography } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXSenderHeaderFixed' });

const hasRef = ref(true);

const Demo = () => {
  const { message } = App.useApp();

  const headerNode = computed(() => (
    <Sender.Header
      open={hasRef.value}
      title={
        <Space>
          <EnterOutlined />
          <Typography.Text type="secondary">"Tell more about Ant Design X"</Typography.Text>
        </Space>
      }
      onOpenChange={v => hasRef.value = v}
    />
  ));

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Switch
        checked={hasRef.value}
        onChange={() => hasRef.value = !hasRef.value}
        checkedChildren="With Reference"
        unCheckedChildren="With Reference"
      />
      <Sender
        header={headerNode.value}
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
