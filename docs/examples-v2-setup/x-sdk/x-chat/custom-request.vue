<script setup lang="ts">
defineOptions({ name: 'AXSdkXChatCustomRequestV2Setup' });

import { computed, ref } from 'vue';
import { Bubble, Sender, DefaultChatProvider, useXChat, XRequest } from 'ant-design-x-vue';

interface ChatInput {
  query: string;
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const content = ref('');
const provider = new DefaultChatProvider<string, ChatInput, string>({
  request: XRequest('https://mock.local/chat', {
    manual: true,
    fetch: async (_url, options: any) => {
      await sleep();
      const params = options?.params as ChatInput | undefined;
      return new Response(JSON.stringify([`Mock success return. You said: ${params?.query}`]), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  }),
});

const { onRequest, messages, isRequesting } = useXChat({
  provider,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
});

const items = computed(() =>
  messages.value.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  })),
);

const roles = {
  ai: { placement: 'start' as const },
  local: {
    placement: 'end' as const,
    contentRender: (msg: ChatInput | string) =>
      typeof msg === 'string' ? msg : (msg as ChatInput)?.query,
  },
};

function submit(nextContent: string) {
  onRequest({ query: nextContent });
  content.value = '';
}
</script>

<template>
  <a-flex vertical gap="middle">
    <Bubble.List style="height: 320px" :items="items" :roles="roles" />
    <Sender
      :loading="isRequesting.value"
      :value="content"
      @update:value="(v) => (content = v)"
      :on-submit="submit"
    />
  </a-flex>
</template>
