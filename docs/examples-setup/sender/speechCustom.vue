<script setup lang="ts">
import { App, message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref, computed } from 'vue';

defineOptions({ name: 'AXSenderSpeechCustomSetup' });

const [messageApi, contextHolder] = message.useMessage();
const recording = ref(false);

const submit = () => {
  messageApi.success('Send message successfully!');
}

const speechConfig = computed(
  () => ({
    // When setting `recording`, the built-in speech recognition feature will be disabled
    recording: recording.value,
    onRecordingChange: (nextRecording) => {
      messageApi.info(`Mock Customize Recording: ${nextRecording}`);
      recording.value = nextRecording;
    },
  }
))
</script>
<template>
  <App>
    <context-holder />
    <Sender
      :allow-speech="speechConfig"
      :on-submit="submit"
    />
  </App>
</template>
