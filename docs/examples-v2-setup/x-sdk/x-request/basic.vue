<script setup lang="ts">
defineOptions({ name: 'AXSdkXRequestBasicV2Setup' });

import { computed, h, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../../../examples-v2/_shared/mock-chat';

const BASE_URL = 'https://mock.local';
const PATH = '/get-user-info';

const status = ref<ThoughtChainItemType['status']>();
const lines = ref<Record<string, string>[]>([]);
const busy = ref(false);

const items = computed(() => [
  {
    key: 'log',
    title: 'Request Log',
    status: status.value,
    icon: status.value === 'loading' ? h(LoadingOutlined) : h(TagsOutlined),
    content: h('pre', { style: { margin: 0, whiteSpace: 'pre-wrap' } },
      lines.value.length ? JSON.stringify(lines.value[lines.value.length - 1], null, 2) : '-'),
  },
]);

function request() {
  busy.value = true;
  status.value = 'loading';
  lines.value = [];
  XRequest(BASE_URL + PATH, {
    fetch: createMockOpenAIFetch(() => 'Hello from XRequest basic.'),
    params: { stream: true, messages: [{ role: 'user', content: 'ping' }] },
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
        lines.value = [...lines.value, msg as Record<string, string>];
      },
    },
  });
}
</script>

<template>
  <a-flex vertical :gap="16" align="flex-start">
    <a-button type="primary" :disabled="busy" @click="request">
      Request - {{ BASE_URL }}{{ PATH }}
    </a-button>
    <ThoughtChain :items="items" />
  </a-flex>
</template>
