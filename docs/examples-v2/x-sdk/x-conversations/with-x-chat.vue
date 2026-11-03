<script setup lang="tsx">
defineOptions({ name: 'AXSdkXConversationsWithXChatV2' });

import { computed, ref } from 'vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import {
  Bubble,
  Conversations,
  Sender,
  createOpenAIChatProvider,
  useXChat,
  useXConversations,
  type XModelMessage,
} from 'ant-design-x-vue';
import { Flex, theme } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockOpenAIFetch } from '../../_shared/mock-chat';

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const getDefaultMessages = (conversationKey: string) => {
  const messagesMap: Record<string, any[]> = {
    item1: [
      { message: { role: 'user', content: 'Hello, this is Conversation 1!' }, status: 'success' },
      {
        message: {
          role: 'assistant',
          content: 'Hello! This is the welcome message for Conversation 1.',
        },
        status: 'success',
      },
    ],
    item2: [
      { message: { role: 'user', content: 'Conversation 2 has started' }, status: 'success' },
      {
        message: {
          role: 'assistant',
          content: 'Welcome to Conversation 2! We can discuss technology topics.',
        },
        status: 'success',
      },
    ],
    item3: [
      { message: { role: 'user', content: 'Clicked on Conversation 3' }, status: 'success' },
      {
        message: {
          role: 'assistant',
          content: 'You selected Conversation 3! How can I help you?',
        },
        status: 'success',
      },
    ],
    item4: [
      { message: { role: 'user', content: 'Conversation 4 initialized' }, status: 'success' },
      {
        message: {
          role: 'assistant',
          content: 'This is Conversation 4. You can still view historical messages.',
        },
        status: 'success',
      },
    ],
  };
  return (
    messagesMap[conversationKey] || [
      { message: { role: 'user', content: 'hello!' }, status: 'success' },
      {
        message: { role: 'assistant', content: 'Hello! How can I assist you today?' },
        status: 'success',
      },
    ]
  );
};

const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
} = useXConversations({
  defaultConversations: items,
  defaultActiveConversationKey: 'item1',
});

const provider = createOpenAIChatProvider<XModelMessage>({
  baseURL: 'https://mock.local/v1/chat/completions',
  model: 'mock-gpt',
  key: 'docs-preview',
  fetch: createMockOpenAIFetch((text) => `Local mock reply: ${text || 'hi'}`),
});

const input = ref('');
const chat = useXChat<XModelMessage>({
  provider,
  conversationKey: activeConversationKey,
  defaultMessages: getDefaultMessages(String(activeConversationKey.value || 'item1')),
  requestPlaceholder: { role: 'assistant', content: '' },
  requestFallback: { role: 'assistant', content: 'Mock request failed.' },
});

const bubbles = computed(() =>
  chat.messages.value.map((info) => ({
    key: info.id,
    role: info.message?.role === 'user' ? 'user' : 'ai',
    content: typeof info.message?.content === 'string' ? info.message.content : '',
    loading: info.status === 'loading' && !info.message?.content,
  })),
);

const { token } = theme.useToken();
const listStyle = computed(() => ({
  width: '220px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

function send() {
  const query = input.value.trim();
  if (!query || chat.isRequesting.value) return;
  input.value = '';
  chat.onRequest({
    messages: [{ role: 'user', content: query }],
    stream: true,
  });
}

defineRender(() => (
  <Flex gap={16} style={{ height: 420 }}>
    <Conversations
      style={listStyle.value}
      items={conversations.value as ConversationsProps['items']}
      activeKey={activeConversationKey.value}
      onActiveChange={(key: string) => setActiveConversationKey(key)}
    />
    <Flex vertical gap={12} style={{ flex: 1, minWidth: 0 }}>
      <Bubble.List
        style={{ flex: 1, minHeight: 0, height: 300 }}
        items={bubbles.value}
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
        loading={chat.isRequesting.value}
        placeholder="Ask the local mock"
        onUpdate:value={(v: string) => { input.value = v; }}
        onSubmit={send}
        onCancel={() => chat.abort()}
      />
    </Flex>
  </Flex>
));
</script>
