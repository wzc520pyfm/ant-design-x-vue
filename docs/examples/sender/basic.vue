<script setup lang="tsx">
import { App, Flex } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watch } from 'vue';

defineOptions({ name: 'AXSenderBasic' });

const value = ref('Hello? this is X!');
const loading = ref<boolean>(false);

const Demo = () => {
  const { message } = App.useApp();

  // Mock send message
  watch(loading, () => {
    if (loading.value) {
      const timer = setTimeout(() => {
        loading.value = false;
        message.success('Send message successfully!');
      }, 3000);
      onWatcherCleanup(() => {
        clearTimeout(timer);
      })
    }
  });

  return (
    <Flex vertical gap="middle">
      <Sender
        loading={loading.value}
        value={value.value}
        onChange={(v) => {
          value.value = v
        }}
        onSubmit={() => {
          value.value = '';
          loading.value = true
          message.info('Send message!');
        }}
        onCancel={() => {
          loading.value = false
          message.error('Cancel sending!');
        }}
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
      <Sender value="Force as loading" loading readOnly />
      <Sender disabled value="Set to disabled" />
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
