<script setup lang="tsx">
defineOptions({ name: 'AXSdkXRequestModelV2' });

import { computed, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Input } from 'ant-design-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../../_shared/mock-chat';

const MODEL = 'mock-gpt';
const questionText = ref('hello, who are u?');
const status = ref('');
const thoughtChainStatus = ref<ThoughtChainItemType['status']>();
const lines = ref<unknown[]>([]);
const requestHandler = XRequest('https://mock.local/v1/chat/completions', {
  manual: true,
  fetch: createMockOpenAIFetch((text) => `Mock model reply for: ${text || questionText.value}`),
  params: { model: MODEL, stream: true },
  callbacks: {
    onSuccess: () => {
      status.value = 'success';
      thoughtChainStatus.value = 'success';
    },
    onError: (error) => {
      status.value = error.message;
      thoughtChainStatus.value = 'error';
    },
    onUpdate: (msg) => {
      lines.value = [...lines.value, msg];
    },
  },
});

function request() {
  status.value = 'pending';
  thoughtChainStatus.value = 'loading';
  lines.value = [];
  requestHandler.run({
    messages: [{ role: 'user', content: questionText.value }],
    stream: true,
  });
}

const items = computed(() => [
  {
    key: 'log',
    title: 'Model Request Log',
    status: thoughtChainStatus.value,
    icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
    description: status.value || 'idle',
    content: (
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 180 }}>
        {lines.value.map((line) => JSON.stringify(line)).join('\n') || '-'}
      </pre>
    ),
  },
]);

defineRender(() => (
  <Flex vertical gap={12} align="flex-start" style={{ width: '100%' }}>
    <Input.TextArea
      value={questionText.value}
      autoSize={{ minRows: 2, maxRows: 4 }}
      onUpdate:value={(v: string) => { questionText.value = v; }}
      style={{ width: '100%' }}
    />
    <Flex gap={8}>
      <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
        Run model request
      </Button>
      <Button onClick={() => requestHandler.abort()}>Abort</Button>
    </Flex>
    <ThoughtChain items={items.value} />
  </Flex>
));
</script>
