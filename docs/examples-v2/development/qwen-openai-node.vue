<script setup lang="tsx">
defineOptions({ name: 'AXDevQwenOpenaiNodeV2' });

import { computed, ref } from 'vue';
import {
  Bubble,
  OpenAIChatProvider,
  Sender,
  useXChat,
  type XModelMessage,
} from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { MockOpenAINodeRequest } from '../_shared/mock-openai-node-request';

const input = ref('');
// DashScope compatible-mode base path (openai-node client.baseURL style). Docs mock the stream.
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
      placeholder="Qwen via custom Request (mock)"
      onUpdate:value={(v: string) => { input.value = v; }}
      onSubmit={() => {
        const query = input.value.trim();
        if (!query) return;
        input.value = '';
        onRequest({ messages: [{ role: 'user', content: query }] });
      }}
      onCancel={() => abort()}
    />
  </Flex>
));
</script>
