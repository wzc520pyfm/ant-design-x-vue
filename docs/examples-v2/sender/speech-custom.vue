<script setup lang="tsx">
defineOptions({ name: 'AXSenderSpeechCustomV2' });

import { ref } from 'vue';
import { Sender } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

const recording = ref(false);

defineRender(() => (
  <Sender
    onSubmit={() => {
      message.success('Send message successfully!');
    }}
    allowSpeech={{
      recording: recording.value,
      onRecordingChange: (nextRecording: boolean) => {
        message.info(`Mock Customize Recording: ${nextRecording}`);
        recording.value = nextRecording;
      },
    }}
  />
));
</script>
