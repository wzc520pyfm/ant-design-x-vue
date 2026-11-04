<script setup lang="ts">
defineOptions({ name: 'AXDevQwenOpenaiNodeV2Setup' });

import { computed, h, ref } from 'vue';
import {
  Bubble,
  OpenAIChatProvider,
  Sender,
  useXChat,
  type XModelMessage,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { MockOpenAINodeRequest } from '../../examples-v2/_shared/mock-openai-node-request';

const input = ref('');
const provider = new OpenAIChatProvider<XModelMessage>({
  request: new MockOpenAINodeRequest(
    'https://dashscope.aliyuncs.com/compatible-mode/v1',
    {},
    (text) =>
      `Local Qwen openai-node style mock for **${text.trim() || 'hello'}**.\n\nclient.baseURL = DashScope compatible-mode；真实 Key 请放在代理后。`,
  ),
});

const { onRequest, messages, isRequesting, abort } = useXChat<XModelMessage>({
  provider,
  requestPlaceholder: { role: 'assistant', content: 'loading...' },
  requestFallback: (_, { error }) => {
    if ((error as Error)?.name === 'AbortError') {
      return { role: 'assistant', content: 'Request is aborted' };
    }
    return { role: 'assistant', content: String(error) };
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
  onRequest({ messages: [{ role: 'user', content: query }] });
}
</script>

<template>
  <a-flex vertical :gap="12" style="height: 420px">
    <Bubble.List style="height: 300px" :items="items" :roles="roles" />
    <Sender
      :value="input"
      :loading="isRequesting.value"
      placeholder="Qwen via custom Request (mock)"
      @update:value="(v) => (input = v)"
      :on-submit="send"
      :on-cancel="() => abort()"
    />
  </a-flex>
</template>
