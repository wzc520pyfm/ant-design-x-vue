<script setup lang="tsx">
defineOptions({ name: 'AXDevQwenSdkV2' });

import { computed, ref } from 'vue';
import {
  Bubble,
  Sender,
  createOpenAIChatProvider,
  useXChat,
  type XModelMessage,
} from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockOpenAIFetch } from '../_shared/mock-chat';

const input = ref('');
// DashScope OpenAI-compatible Chat Completions URL. Docs use a mock fetch.
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

defineRender(() => (
  <Flex vertical gap={12} style={{ height: 420 }}>
    <Bubble.List
      style={{ height: 300 }}
      items={items.value}
      roles={{
        user: { placement: 'end' },
        ai: {
          placement: 'start',
          contentRender: (content: string) => <XMarkdown content={content} />,
        },
      }}
    />
    <Sender
      value={input.value}
      loading={isRequesting.value}
      placeholder="Ask the local Qwen-compatible mock"
      onUpdate:value={(v: string) => { input.value = v; }}
      onSubmit={() => {
        const query = input.value.trim();
        if (!query) return;
        input.value = '';
        onRequest({ messages: [{ role: 'user', content: query }], stream: true });
      }}
      onCancel={() => abort()}
    />
  </Flex>
));
</script>
