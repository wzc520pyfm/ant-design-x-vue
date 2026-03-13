<script setup lang="ts">
defineOptions({ name: 'AXSenderSpeechV2Setup' });

import { Sender } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

const onSubmit = () => {
  message.success('Send message successfully!');
};
</script>

<template>
  <Sender allow-speech @submit="onSubmit" />
</template>
