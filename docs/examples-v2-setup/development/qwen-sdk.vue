<script setup lang="ts">
defineOptions({ name: 'AXDevQwenSdkV2Setup' });

import { computed, h, ref } from 'vue';
import {
  Bubble,
  Sender,
  createOpenAIChatProvider,
  useXChat,
  type XModelMessage,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockOpenAIFetch } from '../../examples-v2/_shared/mock-chat';

const input = ref('');
const provider = createOpenAIChatProvider<XModelMessage>({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  model: 'qwen-plus',
  key: 'docs-preview',
  fetch: createMockOpenAIFetch(
    (userText) =>
      `Local Qwen-compatible mock for **${userText.trim() || 'hello'}**.\n\nbaseURL 指向 DashScope compatible-mode；真实密钥请放在后端代理。`,
  ),
});

const { onRequest, messages, isRequesting, abort } = useXChat<XModelMessage>({
  provider,
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: (_, { error }) => {
    if ((error as Error)?.name === 'AbortError') {
      return { role: 'assistant', content: 'Request is aborted' };
    }
    return { role: 'assistant', content: 'Mock request failed.' };
  },
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
      placeholder="Ask the local Qwen-compatible mock"
      @update:value="(v) => (input = v)"
      :on-submit="send"
      :on-cancel="() => abort()"
    />
  </a-flex>
</template>
