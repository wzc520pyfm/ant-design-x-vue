<script setup lang="ts">
defineOptions({ name: 'AXSdkXRequestModelV2Setup' });

import { computed, h, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../../../examples-v2/_shared/mock-chat';

const MODEL = 'mock-gpt';
const questionText = ref('hello, who are u?');
const status = ref('');
const thoughtChainStatus = ref<ThoughtChainItemType['status']>();
const lines = ref<unknown[]>([]);

const requestHandler = XRequest('https://mock.local/v1/chat/completions', {
  manual: true,
  fetch: createMockOpenAIFetch((text) => `Mock model reply for: ${text || questionText.value}`),
  params: { model: MODEL, stream: true },
  callbacks: {
    onSuccess: () => {
      status.value = 'success';
      thoughtChainStatus.value = 'success';
    },
    onError: (error) => {
      status.value = error.message;
      thoughtChainStatus.value = 'error';
    },
    onUpdate: (msg) => {
      lines.value = [...lines.value, msg];
    },
  },
});

const items = computed(() => [
  {
    key: 'log',
    title: 'Model Request Log',
    status: thoughtChainStatus.value,
    icon: status.value === 'pending' ? h(LoadingOutlined) : h(TagsOutlined),
    description: status.value || 'idle',
    content: h(
      'pre',
      { style: { margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '180px' } },
      lines.value.map((line) => JSON.stringify(line)).join('\n') || '-',
    ),
  },
]);

function request() {
  status.value = 'pending';
  thoughtChainStatus.value = 'loading';
  lines.value = [];
  requestHandler.run({
    messages: [{ role: 'user', content: questionText.value }],
    stream: true,
  });
}
</script>

<template>
  <a-flex vertical :gap="12" align="flex-start" style="width: 100%">
    <a-textarea v-model:value="questionText" :auto-size="{ minRows: 2, maxRows: 4 }" style="width: 100%" />
    <a-flex :gap="8">
      <a-button type="primary" :disabled="status === 'pending'" @click="request">Run model request</a-button>
      <a-button @click="requestHandler.abort()">Abort</a-button>
    </a-flex>
    <ThoughtChain :items="items" />
  </a-flex>
</template>
