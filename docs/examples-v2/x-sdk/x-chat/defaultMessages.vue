<script setup lang="tsx">
defineOptions({ name: 'AXSdkXChatDefaultMessagesV2' });

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
import { createMockOpenAIFetch } from '../../_shared/mock-chat';

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
      placeholder="Continue from history"
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
