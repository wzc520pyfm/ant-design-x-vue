<script setup lang="tsx">
import { message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSubmitType' });
const [messageApi, contextHolder] = message.useMessage();

const Demo = () => {
  return (
    <Sender
      submitType="shiftEnter"
      placeholder="Press Shift + Enter to send message"
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
