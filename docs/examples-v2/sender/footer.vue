<script setup lang="tsx">
defineOptions({ name: 'AXSenderFooterV2' });

import { Sender } from 'ant-design-x-vue';
import { Button, Divider, Flex, Switch, theme } from 'ant-design-vue';
import { ApiOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';

const { token } = theme.useToken();
const loading = ref(false);
const value = ref('');

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';
      console.log('Send message successfully!');
    }, 2000);
    return () => clearTimeout(timer);
  }
});

const iconStyle = { fontSize: '18px', color: token.value.colorText };

defineRender(() => (
  <Sender
    value={value.value}
    onChange={(v) => { value.value = v; }}
    autoSize={{ minRows: 2, maxRows: 6 }}
    placeholder="Press Enter to send message"
    footer={(_, { components }) => {
      const { SendButton, LoadingButton, SpeechButton } = components;
      return (
        <Flex justify="space-between" align="center">
          <Flex gap="small" align="center">
            <Button style={iconStyle} type="text">
              {{ icon: () => <LinkOutlined /> }}
            </Button>
            <Divider type="vertical" />
            Deep Thinking
            <Switch size="small" />
            <Divider type="vertical" />
            <Button>
              {{ icon: () => <SearchOutlined /> }}
              Global Search
            </Button>
          </Flex>
          <Flex align="center">
            <Button type="text" style={iconStyle}>
              {{ icon: () => <ApiOutlined /> }}
            </Button>
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
    onSubmit={() => { loading.value = true; }}
    onCancel={() => { loading.value = false; }}
    suffix={false}
  />
));
</script>
