<script setup lang="tsx">
import { message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSpeech' });
const [messageApi, contextHolder] = message.useMessage();

const Demo = () => {
  return (
    <Sender
      allowSpeech
      onSubmit={() => {
        messageApi.success('Send message successfully!');
      }}
    />
  );
};

defineRender(() => {
  return (
    <>
      <context-holder />
      <Demo />
    </>
  )
});
</script>
