<script setup lang="tsx">
defineOptions({ name: 'AXSenderHeaderFixedV2' });

import { ref } from 'vue';
import { EnterOutlined } from '@ant-design/icons-vue';
import { Sender } from 'ant-design-x-vue';
import { Flex, Switch, Space, Typography, message } from 'ant-design-vue';

const hasRef = ref(true);

const headerNode = () => (
  <Sender.Header
    open={hasRef.value}
    title={
      <Space>
        <EnterOutlined />
        <Typography.Text type="secondary">"Tell more about Ant Design X"</Typography.Text>
      </Space>
    }
    onOpenChange={(val: boolean) => { hasRef.value = val; }}
  />
);

defineRender(() => (
  <Flex vertical gap="middle" align="flex-start">
    <Switch
      checked={hasRef.value}
      onChange={() => { hasRef.value = !hasRef.value; }}
      checkedChildren="With Reference"
      unCheckedChildren="With Reference"
    />
    <Sender
      header={headerNode()}
      onSubmit={() => {
        message.success('Send message successfully!');
      }}
    />
  </Flex>
));
</script>
