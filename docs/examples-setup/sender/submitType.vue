<script setup lang="ts">
import { App, message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSubmitTypeSetup' });

const [messageApi, contextHolder] = message.useMessage();

const submit = () => {
  messageApi.success('Send message successfully!'); 
}
</script>
<template>
  <App>
    <context-holder />
    <Sender
      submit-type="shiftEnter"
      placeholder="Press Shift + Enter to send message"
      :on-submit="submit"
    />
  </App>
</template>
