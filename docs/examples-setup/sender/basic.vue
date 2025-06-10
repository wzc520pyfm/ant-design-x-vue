<script setup lang="ts">
import { message, Flex } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watch } from 'vue';

defineOptions({ name: 'AXSenderBasicSetup' });

const [messageApi, contextHolder] = message.useMessage();

const value = ref('Hello? this is X!');
const loading = ref<boolean>(false);

// Mock send message
watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false;
      messageApi.success('Send message successfully!');
    }, 3000);
    onWatcherCleanup(() => {
      clearTimeout(timer);
    })
  }
});
</script>
<template>
  <contextHolder />
  <Flex
    vertical
    gap="middle"
  >
    <Sender
      v-model:value="value"
      :loading="loading"
      :auto-size="{ minRows: 2, maxRows: 6 }"
      @submit="() => {
        value = '';
        loading = true
        messageApi.info('Send message!');
      }"
      @cancel="() => {
        loading = false
        messageApi.error('Cancel sending!');
      }"
    />
    <Sender
      value="Force as loading"
      loading
      read-only
    />
    <Sender
      disabled
      value="Set to disabled"
    />
  </Flex>
</template>
