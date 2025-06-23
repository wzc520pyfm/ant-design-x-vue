<script setup lang="tsx">
import { h } from 'vue';
import { App } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { SoundOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'AXSenderSpeechIcon' });

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Sender
      allowSpeech
      onSubmit={() => {
        message.success('Send message successfully!');
      }}
      audioIcon={h(SoundOutlined)}
      audioDisabledIcon={h(SoundOutlined, { style: { color: 'gray' } })}
      audioRecordingIcon={h(EllipsisOutlined)}
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
