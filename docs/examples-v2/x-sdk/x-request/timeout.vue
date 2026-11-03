<script setup lang="tsx">
defineOptions({ name: 'AXSdkXRequestTimeoutV2' });

import { computed, ref } from 'vue';
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';

const BASE_URL = 'https://mock.local';
const PATH = '/chat';

async function mockFetch() {
  return new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve(
        new Response('{ "data": "Hi" }', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }, 3000);
  });
}

const status = ref('');
const thoughtChainStatus = ref<ThoughtChainItemType['status']>();

function request() {
  status.value = 'pending';
  thoughtChainStatus.value = 'loading';
  XRequest(BASE_URL + PATH, {
    timeout: 2000,
    fetch: mockFetch,
    callbacks: {
      onSuccess: () => {
        status.value = 'success';
        thoughtChainStatus.value = 'success';
      },
      onError: (error) => {
        status.value = error.message === 'TimeoutError' ? 'TimeoutError' : error.message;
        thoughtChainStatus.value = 'error';
      },
    },
  });
}

const items = computed(() => [
  {
    key: 'log',
    title: 'Request Log',
    status: thoughtChainStatus.value,
    icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
    description: `request ${status.value || '-'}`,
    content: (
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Status">{status.value || '-'}</Descriptions.Item>
        <Descriptions.Item label="timeout">2000ms (mock arrives at 3000ms)</Descriptions.Item>
      </Descriptions>
    ),
  },
]);

defineRender(() => (
  <Flex vertical gap={16} align="flex-start">
    <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
      Request - {BASE_URL}{PATH}
    </Button>
    <ThoughtChain items={items.value} />
  </Flex>
));
</script>
