<script setup lang="tsx">
import { ApiOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { Button, Divider, Flex, Switch, theme } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref, watch } from 'vue';

defineOptions({ name: 'AXSenderFooter' });

const { token } = theme.useToken();
const loading = ref<boolean>(false);
const value = ref<string>('');

const iconStyle = {
  fontSize: 18,
  color: token.value.colorText,
}

watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';

      console.log('Send message successfully!');
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }
});

defineRender(() => {
  return (
    <Sender
      value={value.value}
      onChange={(v) => {
        value.value = v;
      }}
      // autoSize={{ minRows: 2, maxRows: 6 }}
      placeholder="Press Enter to send message"
      footer={({ components }) => {
        const { SendButton, LoadingButton, SpeechButton } = components;
        return (
          <Flex justify="space-between" align="center">
            <Flex gap="small" align="center">
              <Button style={iconStyle} type="text" icon={<LinkOutlined />} />
              <Divider type="vertical" />
              Deep Thinking
              <Switch size="small" />
              <Divider type="vertical" />
              <Button icon={<SearchOutlined />}>Global Search</Button>
            </Flex>
            <Flex align="center">
              <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
              <Divider type="vertical" />
              <SpeechButton style={iconStyle} />
              <Divider type="vertical" />
              {loading.value ? (
                <LoadingButton type="default" />
              ) : (
                <SendButton type="primary" disabled={false} />
              )}
            </Flex>
          </Flex>
        );
      }}
      onSubmit={() => {
        loading.value = true;
      }}
      onCancel={() => {
        loading.value = false;
      }}
      actions={false}
    />
  );
})
</script>
