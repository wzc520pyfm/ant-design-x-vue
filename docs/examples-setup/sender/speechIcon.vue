<script setup lang="ts">
import { h } from 'vue';
import { App, message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { SoundOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'AXSenderSpeechIconSetup' });

const [messageApi, contextHolder] = message.useMessage();

const submit = () => {
  messageApi.success('Send message successfully!');
};
</script>
<template>
  <App>
    <context-holder />
    <Sender
      :allow-speech="{
        audioIcon: h(SoundOutlined),
        audioDisabledIcon: h(SoundOutlined, { style: { color: 'gray' } }),
        audioRecordingIcon: h(EllipsisOutlined)
      }"
      :on-submit="submit"
    />
  </App>
</template>
