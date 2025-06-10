<script setup lang="ts">
import { App, message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSpeechSetup' });

const [messageApi, contextHolder] = message.useMessage();

const submit = () => {
  messageApi.success('Send message successfully!');
};

</script>
<template>
  <App>
    <context-holder />
    <Sender
      :allow-speech="true"
      :on-submit="submit"
    />
  </App>
</template>
