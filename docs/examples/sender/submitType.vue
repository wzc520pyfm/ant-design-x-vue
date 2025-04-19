<script setup lang="tsx">
import { App } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSubmitType' });

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Sender
      submitType="shiftEnter"
      placeholder="Press Shift + Enter to send message"
      onSubmit={() => {
        message.success('Send message successfully!');
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
