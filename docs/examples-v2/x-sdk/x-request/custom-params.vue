<script setup lang="tsx">
defineOptions({ name: 'AXSdkXRequestCustomParamsV2' });

import { computed, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../../_shared/mock-chat';

const BASE_URL = 'https://mock.local';
const PATH = '/chat';

const status = ref<ThoughtChainItemType['status']>();
const lines = ref<unknown[]>([]);
const busy = ref(false);

function request() {
  busy.value = true;
  status.value = 'loading';
  lines.value = [];
  XRequest(BASE_URL + PATH, {
    fetch: createMockOpenAIFetch(() => 'Custom params mock reply.'),
    params: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
      agentId: 111,
    },
    callbacks: {
      onSuccess: () => {
        status.value = 'success';
        busy.value = false;
      },
      onError: () => {
        status.value = 'error';
        busy.value = false;
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg];
      },
    },
  });
}

const items = computed(() => [
  {
    key: 'log',
    title: 'Request Log',
    status: status.value,
    icon: status.value === 'loading' ? <LoadingOutlined /> : <TagsOutlined />,
    content: (
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto' }}>
        {lines.value.map((line) => JSON.stringify(line)).join('\n') || '-'}
      </pre>
    ),
  },
]);

defineRender(() => (
  <Flex vertical gap={16} align="flex-start">
    <Button type="primary" disabled={busy.value} onClick={request}>
      Request with custom params
    </Button>
    <ThoughtChain items={items.value} />
  </Flex>
));
</script>
