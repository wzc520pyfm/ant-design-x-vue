<script setup lang="ts">
defineOptions({ name: 'AXSenderSubmitTypeV2Setup' });

import { Sender } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

const onSubmit = () => {
  message.success('Send message successfully!');
};
</script>

<template>
  <Sender
    submit-type="shiftEnter"
    placeholder="Press Shift + Enter to send message"
    @submit="onSubmit"
  />
</template>
