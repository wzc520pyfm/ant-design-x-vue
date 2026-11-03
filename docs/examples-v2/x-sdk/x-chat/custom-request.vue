<script setup lang="tsx">
defineOptions({ name: 'AXSdkXChatCustomRequestV2' });

import { computed, ref } from 'vue';
import { Bubble, Sender, DefaultChatProvider, useXChat, XRequest } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

interface ChatInput {
  query: string;
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const content = ref('');
const provider = new DefaultChatProvider<string, ChatInput, string>({
  request: XRequest('https://mock.local/chat', {
    manual: true,
    fetch: async (_url, options: any) => {
      await sleep();
      const params = options?.params as ChatInput | undefined;
      return new Response(JSON.stringify([`Mock success return. You said: ${params?.query}`]), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  }),
});

const { onRequest, messages, isRequesting } = useXChat({
  provider,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
});

const items = computed(() =>
  messages.value.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  })),
);

defineRender(() => (
  <Flex vertical gap="middle">
    <Bubble.List
      style={{ height: 320 }}
      items={items.value}
      roles={{
        ai: { placement: 'start' },
        local: {
          placement: 'end',
          contentRender: (msg: ChatInput | string) =>
            typeof msg === 'string' ? msg : (msg as ChatInput)?.query,
        },
      }}
    />
    <Sender
      loading={isRequesting.value}
      value={content.value}
      onUpdate:value={(v: string) => { content.value = v; }}
      onSubmit={(nextContent: string) => {
        onRequest({ query: nextContent });
        content.value = '';
      }}
    />
  </Flex>
));
</script>
