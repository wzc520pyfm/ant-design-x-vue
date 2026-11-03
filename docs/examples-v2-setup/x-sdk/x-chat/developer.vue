<script setup lang="ts">
defineOptions({ name: 'AXSdkXChatDeveloperV2Setup' });

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
  fetch: createMockOpenAIFetch((text) => `System-aware mock reply: ${text || 'hi'}`),
});

const { onRequest, messages, isRequesting, abort, setMessage } = useXChat<XModelMessage>({
  provider,
  defaultMessages: [
    {
      id: 'developer',
      message: { role: 'developer', content: 'You are a helpful chatbot' },
      status: 'local',
    },
  ],
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: { role: 'assistant', content: 'Mock request failed.' },
});

const chatMessages = computed(() =>
  messages.value.filter((m) => (m.message as any)?.role !== 'developer'),
);

const developerPrompt = computed(
  () => messages.value.find((m) => (m.message as any)?.role === 'developer')?.message?.content || 'None',
);

const items = computed(() =>
  chatMessages.value.map((info) => ({
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

function updatePrompt() {
  setMessage('developer', {
    message: { role: 'developer', content: 'Modified system prompt' },
    status: 'local',
  } as any);
}

function send() {
  const query = input.value.trim();
  if (!query) return;
  input.value = '';
  onRequest({ messages: [{ role: 'user', content: query }], stream: true });
}
</script>

<template>
  <a-flex vertical :gap="12" style="height: 460px">
    <a-flex :gap="8" align="center" wrap="wrap">
      <a-typography-text>
        System prompt: <code>{{ developerPrompt }}</code>
      </a-typography-text>
      <a-button size="small" @click="updatePrompt">Update system prompt</a-button>
    </a-flex>
    <Bubble.List style="height: 280px" :items="items" :roles="roles" />
    <Sender
      :value="input"
      :loading="isRequesting.value"
      placeholder="Chat with a system prompt"
      @update:value="(v) => (input = v)"
      :on-submit="send"
      :on-cancel="() => abort()"
    />
  </a-flex>
</template>
