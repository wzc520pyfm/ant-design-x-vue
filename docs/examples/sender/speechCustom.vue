<script setup lang="tsx">
import { App } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSenderSpeechCustom' });

const recording = ref(false);

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Sender
      onSubmit={() => {
        message.success('Send message successfully!');
      }}
      allowSpeech={{
        // When setting `recording`, the built-in speech recognition feature will be disabled
        recording: recording.value,
        onRecordingChange: (nextRecording) => {
          message.info(`Mock Customize Recording: ${nextRecording}`);
          recording.value = nextRecording;
        },
      }}
    />
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  )
});

</script>
