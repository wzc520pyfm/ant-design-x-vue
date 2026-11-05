<script setup lang="ts">
defineOptions({ name: 'AXSenderSpeechCustomV2Setup' });

import { ref } from 'vue';
import { Sender } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

const recording = ref(false);

const onSubmit = () => {
  message.success('Send message successfully!');
};

const onRecordingChange = (nextRecording: boolean) => {
  message.info(`Mock Customize Recording: ${nextRecording}`);
  recording.value = nextRecording;
};
</script>

<template>
  <Sender
    :allow-speech="{ recording, onRecordingChange }"
    @submit="onSubmit"
  />
</template>
