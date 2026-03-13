<script setup lang="tsx">
defineOptions({ name: 'AXSenderSubmitTypeV2' });

import { Sender } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

defineRender(() => (
  <Sender
    submitType="shiftEnter"
    placeholder="Press Shift + Enter to send message"
    onSubmit={() => {
      message.success('Send message successfully!');
    }}
  />
));
</script>
