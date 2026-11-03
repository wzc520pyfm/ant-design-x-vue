<script setup lang="tsx">
defineOptions({ name: 'AXSdkXChatDeveloperV2' });

import { computed, ref } from 'vue';
import {
  Bubble,
  Sender,
  createOpenAIChatProvider,
  useXChat,
  type XModelMessage,
} from 'ant-design-x-vue';
import { Button, Flex, Typography } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockOpenAIFetch } from '../../_shared/mock-chat';

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

defineRender(() => (
  <Flex vertical gap={12} style={{ height: 460 }}>
    <Flex gap={8} align="center" wrap="wrap">
      <Typography.Text>
        System prompt: <code>{String(developerPrompt.value)}</code>
      </Typography.Text>
      <Button
        size="small"
        onClick={() =>
          setMessage('developer', {
            message: { role: 'developer', content: 'Modified system prompt' },
            status: 'local',
          } as any)
        }
      >
        Update system prompt
      </Button>
    </Flex>
    <Bubble.List
      style={{ height: 280 }}
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
      placeholder="Chat with a system prompt"
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
