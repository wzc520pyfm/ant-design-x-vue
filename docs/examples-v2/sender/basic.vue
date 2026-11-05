<script setup lang="tsx">
defineOptions({ name: 'AXSenderBasicV2' });

import { Sender } from 'ant-design-x-vue';
import { Flex, message } from 'ant-design-vue';
import { ref, watch } from 'vue';

const value = ref<string>('Hello? this is X!');
const loading = ref(false);

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
      message.success('Send message successfully!');
    }, 3000);
    return () => clearTimeout(timer);
  }
});

defineRender(() => (
  <Flex vertical gap="middle">
    <Sender
      loading={loading.value}
      value={value.value}
      onChange={(v) => { value.value = v; }}
      onSubmit={() => {
        value.value = '';
        loading.value = true;
        message.info('Send message!');
      }}
      onCancel={() => {
        loading.value = false;
        message.error('Cancel sending!');
      }}
      autoSize={{ minRows: 4, maxRows: 6 }}
    />
    <Sender value="Force as loading" loading readOnly autoSize={true} />
    <Sender disabled value="Set to disabled" />
  </Flex>
));
</script>
