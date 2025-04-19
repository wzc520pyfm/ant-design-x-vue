<script setup lang="tsx">
import { App } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSpeech' });

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Sender
      allowSpeech
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
