<script setup lang="ts">
defineOptions({ name: 'AXSdkXRequestTimeoutV2Setup' });

import { computed, h, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';

const BASE_URL = 'https://mock.local';
const PATH = '/chat';

async function mockFetch() {
  return new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve(
        new Response('{ "data": "Hi" }', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }, 3000);
  });
}

const status = ref('');
const thoughtChainStatus = ref<ThoughtChainItemType['status']>();

const items = computed(() => [
  {
    key: 'log',
    title: 'Request Log',
    status: thoughtChainStatus.value,
    icon: status.value === 'pending' ? h(LoadingOutlined) : h(TagsOutlined),
    description: `request ${status.value || '-'}`,
    content: h('div', [
      h('div', `Status: ${status.value || '-'}`),
      h('div', 'timeout: 2000ms (mock arrives at 3000ms)'),
    ]),
  },
]);

function request() {
  status.value = 'pending';
  thoughtChainStatus.value = 'loading';
  XRequest(BASE_URL + PATH, {
    timeout: 2000,
    fetch: mockFetch,
    callbacks: {
      onSuccess: () => {
        status.value = 'success';
        thoughtChainStatus.value = 'success';
      },
      onError: (error) => {
        status.value = error.message === 'TimeoutError' ? 'TimeoutError' : error.message;
        thoughtChainStatus.value = 'error';
      },
    },
  });
}
</script>

<template>
  <a-flex vertical :gap="16" align="flex-start">
    <a-button type="primary" :disabled="status === 'pending'" @click="request">
      Request - {{ BASE_URL }}{{ PATH }}
    </a-button>
    <ThoughtChain :items="items" />
  </a-flex>
</template>
