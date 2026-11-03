<script setup lang="ts">
defineOptions({ name: 'AXSdkXChatDefaultMessagesV2Setup' });

import { computed, h, ref } from 'vue';
import {
  Bubble,
  Sender,
  createOpenAIChatProvider,
  useXChat,
  type XModelMessage,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockOpenAIFetch } from '../../../examples-v2/_shared/mock-chat';

const input = ref('');
const provider = createOpenAIChatProvider<XModelMessage>({
  baseURL: 'https://mock.local/v1/chat/completions',
  model: 'mock-gpt',
  key: 'docs-preview',
  fetch: createMockOpenAIFetch(),
});

const { onRequest, messages, isRequesting, abort } = useXChat<XModelMessage>({
  provider,
  defaultMessages: [
    { message: { role: 'user', content: 'What is Ant Design X?' }, status: 'success' },
    {
      message: {
        role: 'assistant',
        content: 'Ant Design X is a React/Vue AI interaction component library.',
      },
      status: 'success',
    },
  ],
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
    contentRender: (content: string) => h(XMarkdown, { content }),
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
      placeholder="Continue from history"
      @update:value="(v) => (input = v)"
      :on-submit="send"
      :on-cancel="() => abort()"
    />
  </a-flex>
</template>
