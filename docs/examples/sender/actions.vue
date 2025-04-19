<script setup lang="tsx">
import { App, Space, Spin, Typography } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watch } from 'vue';

defineOptions({ name: 'AXSenderActions' });

const value = ref('');
const loading = ref<boolean>(false);

const Demo = () => {
  const { message } = App.useApp();

  // Mock send message
  watch(loading, () => {
    if (loading.value) {
      const timer = setTimeout(() => {
        loading.value = false;
        value.value = '';
        message.success('Send message successfully!');
      }, 2000);

      onWatcherCleanup(() => {
        clearTimeout(timer);
      });
    }
  });

  return (
    <Sender
      submitType="shiftEnter"
      loading={loading.value}
      value={value.value}
      onChange={(v) => {
        console.log('Sender onChange', v)
        value.value = v
      }}
      onSubmit={() => {
        loading.value = true;
      }}
      onCancel={() => {
        loading.value = false;
      }}
      actions={(_, info) => {
        const { SendButton, LoadingButton, ClearButton, SpeechButton } = info.components;

        return (
          <Space size="small">
            <Typography.Text type="secondary">
              <small>`Shift + Enter` to submit</small>
            </Typography.Text>
            <ClearButton />
            <SpeechButton />
            {loading.value ? (
              <LoadingButton type="default" icon={<Spin size="small" />} disabled style={{ display: 'block' }} />
            ) : (
              <SendButton type="primary" disabled={false} />
            )}
          </Space>
        );
      }}
    />
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
