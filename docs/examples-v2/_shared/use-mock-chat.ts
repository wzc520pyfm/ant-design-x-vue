import { computed, ref } from 'vue';
import {
  createOpenAIChatProvider,
  useXChat,
  useXConversations,
  type XModelMessage,
} from 'ant-design-x-vue';
import { createMockOpenAIFetch, defaultMockReply } from './mock-chat';

export function useMockChat(replyFor: (userText: string) => string = defaultMockReply) {
  const input = ref('');
  const conversationsApi = useXConversations({
    defaultConversations: [{ key: '1', label: 'New chat' }],
    defaultActiveConversationKey: '1',
  });

  const provider = createOpenAIChatProvider<XModelMessage>({
    baseURL: 'https://mock.local/v1/chat/completions',
    model: 'mock-gpt',
    key: 'docs-preview',
    fetch: createMockOpenAIFetch(replyFor),
  });

  const chat = useXChat<XModelMessage>({
    provider,
    conversationKey: conversationsApi.activeConversationKey,
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

  function send(text?: string) {
    const query = (text ?? input.value).trim();
    if (!query || chat.isRequesting.value) return;
    input.value = '';
    chat.onRequest({
      messages: [{ role: 'user', content: query }],
      stream: true,
    });
  }

  function addChat() {
    const key = `c_${Date.now()}`;
    conversationsApi.addConversation({ key, label: 'New chat' }, 'prepend');
    conversationsApi.setActiveConversationKey(key);
  }

  return {
    input,
    bubbles,
    send,
    addChat,
    ...conversationsApi,
    isRequesting: chat.isRequesting,
    abort: chat.abort,
    messages: chat.messages,
  };
}
