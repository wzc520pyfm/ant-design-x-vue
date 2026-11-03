<script setup lang="tsx">
defineOptions({ name: 'AXSdkXRequestBasicV2' });

import { computed, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../../_shared/mock-chat';

const BASE_URL = 'https://mock.local';
const PATH = '/get-user-info';

const status = ref<ThoughtChainItemType['status']>();
const lines = ref<Record<string, string>[]>([]);
const busy = ref(false);

function request() {
  busy.value = true;
  status.value = 'loading';
  lines.value = [];
  XRequest(BASE_URL + PATH, {
    fetch: createMockOpenAIFetch(() => 'Hello from XRequest basic.'),
    params: { stream: true, messages: [{ role: 'user', content: 'ping' }] },
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
        lines.value = [...lines.value, msg as Record<string, string>];
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
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Chunks">{String(lines.value.length)}</Descriptions.Item>
        <Descriptions.Item label="Last">
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {lines.value.length ? JSON.stringify(lines.value[lines.value.length - 1]) : '-'}
          </pre>
        </Descriptions.Item>
      </Descriptions>
    ),
  },
]);

defineRender(() => (
  <Flex vertical gap={16} align="flex-start">
    <Button type="primary" disabled={busy.value} onClick={request}>
      Request - {BASE_URL}{PATH}
    </Button>
    <ThoughtChain items={items.value} />
  </Flex>
));
</script>
