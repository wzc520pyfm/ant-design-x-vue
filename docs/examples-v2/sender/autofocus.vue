<script setup lang="tsx">
defineOptions({ name: 'AXSenderAutofocusV2' });

import { Sender } from 'ant-design-x-vue';

defineRender(() => (
  <Sender autofocus placeholder="Automatically focused after mounting" />
));
</script>
