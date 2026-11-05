<script setup lang="ts">
defineOptions({ name: 'AXSdkXRequestCustomParamsV2Setup' });

import { computed, h, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../../../examples-v2/_shared/mock-chat';

const status = ref<ThoughtChainItemType['status']>();
const lines = ref<unknown[]>([]);
const busy = ref(false);

const items = computed(() => [
  {
    key: 'log',
    title: 'Request Log',
    status: status.value,
    icon: status.value === 'loading' ? h(LoadingOutlined) : h(TagsOutlined),
    content: h(
      'pre',
      { style: { margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto' } },
      lines.value.map((line) => JSON.stringify(line)).join('\n') || '-',
    ),
  },
]);

function request() {
  busy.value = true;
  status.value = 'loading';
  lines.value = [];
  XRequest('https://mock.local/chat', {
    fetch: createMockOpenAIFetch(() => 'Custom params mock reply.'),
    params: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
      agentId: 111,
    },
    callbacks: {
      onSuccess: () => {
        status.value = 'success';
        busy.value = false;
      },
      onError: () => {
        status.value = 'error';
        busy.value = false;
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg];
      },
    },
  });
}
</script>

<template>
  <a-flex vertical :gap="16" align="flex-start">
    <a-button type="primary" :disabled="busy" @click="request">Request with custom params</a-button>
    <ThoughtChain :items="items" />
  </a-flex>
</template>
