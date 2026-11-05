<script setup lang="ts">
defineOptions({ name: 'AXSdkXChatDeepSeekV2Setup' });

import { computed, h, ref } from 'vue';
import {
  Bubble,
  Sender,
  Think,
  DeepSeekChatProvider,
  useXChat,
  XRequest,
  type XModelMessage,
  type XModelParams,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockDeepSeekFetch } from '../../../examples-v2/_shared/mock-chat';

const input = ref('');
const provider = new DeepSeekChatProvider<XModelMessage, XModelParams>({
  request: XRequest('https://mock.local/v1/chat/completions', {
    manual: true,
    fetch: createMockDeepSeekFetch() as never,
    params: { stream: true, model: 'mock-deepseek' },
  }),
});

const { onRequest, messages, isRequesting, abort } = useXChat<XModelMessage>({
  provider,
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: { role: 'assistant', content: 'Mock request failed.' },
});

const items = computed(() =>
  messages.value.map((info) => ({
    key: info.id,
    role: info.message?.role === 'user' ? 'user' : 'ai',
    content: typeof info.message?.content === 'string' ? info.message.content : '',
    loading: info.status === 'loading' && !info.message?.content,
  })),
);

const roles = {
  user: { placement: 'end' as const },
  ai: {
    placement: 'start' as const,
    contentRender: (content: string) =>
      h(XMarkdown, { content, components: { think: Think } }),
  },
};

function send() {
  const query = input.value.trim();
  if (!query) return;
  input.value = '';
  onRequest({ messages: [{ role: 'user', content: query }], stream: true });
}
</script>

<template>
  <a-flex vertical :gap="12" style="height: 420px">
    <Bubble.List style="height: 300px" :items="items" :roles="roles" />
    <Sender
      :value="input"
      :loading="isRequesting.value"
      placeholder="Ask the local DeepSeek mock"
      @update:value="(v) => (input = v)"
      :on-submit="send"
      :on-cancel="() => abort()"
    />
  </a-flex>
</template>
