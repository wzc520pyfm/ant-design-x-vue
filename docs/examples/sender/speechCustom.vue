<script setup lang="tsx">
import { message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSenderSpeechCustom' });
const [messageApi, contextHolder] = message.useMessage();

const recording = ref(false);

const Demo = () => {
  return (
    <Sender
      onSubmit={() => {
        messageApi.success('Send message successfully!');
      }}
      allowSpeech={{
        // When setting `recording`, the built-in speech recognition feature will be disabled
        recording: recording.value,
        onRecordingChange: (nextRecording) => {
          messageApi.info(`Mock Customize Recording: ${nextRecording}`);
          recording.value = nextRecording;
        },
      }}
    />
  );
};

defineRender(() => {
  return (
    <>
      <contextHolder />
      <Demo />
    </>
  )
});
</script>
