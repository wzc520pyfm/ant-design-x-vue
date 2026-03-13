<script setup lang="ts">
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

const onSubmit = () => {
  value.value = '';
  loading.value = true;
  message.info('Send message!');
};

const onCancel = () => {
  loading.value = false;
  message.error('Cancel sending!');
};
</script>

<template>
  <Flex vertical gap="middle">
    <Sender
      :loading="loading"
      v-model:value="value"
      :auto-size="{ minRows: 4, maxRows: 6 }"
      @submit="onSubmit"
      @cancel="onCancel"
    />
    <Sender value="Force as loading" loading read-only :auto-size="true" />
    <Sender disabled value="Set to disabled" />
  </Flex>
</template>
