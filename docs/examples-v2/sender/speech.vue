<script setup lang="tsx">
defineOptions({ name: 'AXSenderSpeechV2' });

import { Sender } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

defineRender(() => (
  <Sender
    onSubmit={() => {
      message.success('Send message successfully!');
    }}
    allowSpeech
  />
));
</script>
