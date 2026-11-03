<script setup lang="tsx">
defineOptions({ name: 'AXSdkXChatDeepSeekV2' });

import { computed, ref } from 'vue';
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
import { Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { createMockDeepSeekFetch } from '../../_shared/mock-chat';

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

defineRender(() => (
  <Flex vertical gap={12} style={{ height: 420 }}>
    <Bubble.List
      style={{ height: 300 }}
      items={items.value}
      roles={{
        user: { placement: 'end' },
        ai: {
          placement: 'start',
          contentRender: (content: string) => (
            <XMarkdown content={content} components={{ think: Think }} />
          ),
        },
      }}
    />
    <Sender
      value={input.value}
      loading={isRequesting.value}
      placeholder="Ask the local DeepSeek mock"
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
