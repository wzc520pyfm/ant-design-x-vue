<script setup lang="ts">
defineOptions({ name: 'AXSdkXRequestV2Setup' });

import { ref } from 'vue';
import { XRequest } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../_shared/mock-chat';

const lines = ref<string[]>([]);

const request = XRequest('https://mock.local/v1/chat/completions', {
  manual: true,
  fetch: createMockOpenAIFetch(() => 'Hello from XRequest.'),
  params: {
    stream: true,
    messages: [{ role: 'user', content: 'hello' }],
  },
  callbacks: {
    onUpdate(chunk) {
      lines.value = [...lines.value, JSON.stringify(chunk)];
    },
    onSuccess() {
      lines.value = [...lines.value, 'success'];
    },
    onError(error) {
      lines.value = [...lines.value, error.message];
    },
  },
});

function run() {
  lines.value = [];
  request.run();
}
</script>

<template>
  <a-flex vertical :gap="12">
    <a-button type="primary" @click="run">Run manual request</a-button>
    <pre style="white-space: pre-wrap">{{ lines.join('\n') || 'Idle. manual is true, so nothing runs until the button.' }}</pre>
  </a-flex>
</template>
