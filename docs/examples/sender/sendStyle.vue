<script setup lang="tsx">
import { SendOutlined } from '@ant-design/icons-vue';
import { type ButtonProps, App, Flex, Tooltip } from 'ant-design-vue';
import { Sender, theme } from 'ant-design-x-vue';
import { type CSSProperties, onWatcherCleanup, ref, watch } from 'vue';

defineOptions({ name: 'AXSenderSendStyle' });

const { token } = theme.useToken();

const value = ref('Ask something?');
const loading = ref(false);

const Demo = () => {
  const { message } = App.useApp();

  watch(loading, () => {
    if (loading.value) {
      const timer = setTimeout(() => {
        loading.value = false;
      }, 3000);

      onWatcherCleanup(() => {
        clearTimeout(timer);
      })
    }
  });

  const renderSend = (
    props: ButtonProps & { ignoreLoading?: boolean; placeholder?: string; style?: CSSProperties } = {},
  ) => {
    const { ignoreLoading, placeholder, ...btnProps } = props;

    return (
      <Sender
        value={value.value}
        onChange={v => value.value = v}
        loading={loading.value}
        onSubmit={(msg) => {
          message.success(`Send: ${msg}`);
          value.value = ''
          loading.value = true
        }}
        placeholder={placeholder}
        onCancel={() => {
          loading.value = false
        }}
        actions={(_, info) => {
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
              <Tooltip title={value.value ? 'Send \u21B5' : 'Please type something'}>{node}</Tooltip>
            );
          }

          return node;
        }}
      />
    );
  };

  return (
    <Flex vertical gap="middle">
      {renderSend({
        shape: 'default',
        placeholder: 'Change button border radius',
        style: { borderRadius: '12px' },
      })}
      {renderSend({
        type: 'text',
        // variant: 'text',
        placeholder: 'Change button icon',
        // color: 'primary',
        style: { color: token.value.colorPrimary },
        icon: <SendOutlined />,
        shape: 'default',
      })}
      {renderSend({ ignoreLoading: true, placeholder: 'Loading not change button' })}
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
