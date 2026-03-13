<script setup lang="tsx">
defineOptions({ name: 'AXSenderSendStyleV2' });

import { Sender } from 'ant-design-x-vue';
import { Flex, Tooltip, message } from 'ant-design-vue';
import { SendOutlined } from '@ant-design/icons-vue';
import { ref, watch, type VNode } from 'vue';

const value = ref('Ask something?');
const loading = ref(false);

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
    }, 3000);
    return () => clearTimeout(timer);
  }
});

const renderSend = (props: Record<string, any> = {}): VNode => {
  const { ignoreLoading, placeholder, ...btnProps } = props;

  return (
    <Sender
      value={value.value}
      onChange={(v) => { value.value = v; }}
      loading={loading.value}
      onSubmit={(msg) => {
        message.success(`Send: ${msg}`);
        value.value = '';
        loading.value = true;
      }}
      placeholder={placeholder}
      onCancel={() => { loading.value = false; }}
      suffix={(_, info) => {
        const { SendButton, LoadingButton } = info.components;

        if (!ignoreLoading && loading.value) {
          return (
            <Tooltip title="Click to cancel">
              <LoadingButton />
            </Tooltip>
          );
        }

        let node = <SendButton {...btnProps} />;

        if (!ignoreLoading) {
          node = (
            <Tooltip title={value.value ? 'Send ↵' : 'Please type something'}>{node}</Tooltip>
          );
        }

        return node;
      }}
    />
  );
};

defineRender(() => (
  <Flex vertical gap="middle">
    {renderSend({
      shape: 'default',
      placeholder: 'Change button border radius',
      style: { borderRadius: '12px' },
    })}
    {renderSend({
      variant: 'text',
      placeholder: 'Change button icon',
      color: 'primary',
      icon: <SendOutlined />,
      shape: 'default',
    })}
    {renderSend({ ignoreLoading: true, placeholder: 'Loading not change button' })}
  </Flex>
));
</script>
