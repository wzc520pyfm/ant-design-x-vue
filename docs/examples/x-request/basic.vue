<script setup lang="tsx">
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, XRequest } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXXRequestBasic' });

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com';
const PATH = '/chat';
const MODEL = 'gpt-3.5-turbo';
// const API_KEY = '';

const exampleRequest = XRequest({
  baseURL: BASE_URL + PATH,
  model: MODEL,

  /** 🔥🔥 Its dangerously! */
  // dangerouslyApiKey: API_KEY
});

const status = ref<ThoughtChainItem['status']>();
const lines = ref<Record<string, string>[]>([]);

async function request() {
  status.value = 'pending';

  await exampleRequest.value.create(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
      agentId: 111,
    },
    {
      onSuccess: (messages) => {
        status.value = 'success';
        console.log('onSuccess', messages);
      },
      onError: (error) => {
        status.value = 'error';
        console.error('onError', error);
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg];
        console.log('onUpdate', msg);
      },
    },
  );
}

defineRender(() => {
  return (
    <Flex align="start" gap={16} style={{ overflow: 'auto' }}>
      <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
        Request - {BASE_URL}
        {PATH}
      </Button>
      <ThoughtChain
        items={[
          {
            title: 'Request Log',
            status: status.value,
            icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
            description:
              status.value === 'error' &&
              exampleRequest.value.baseURL === BASE_URL + PATH &&
              'Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.',
            content: (
              <Descriptions column={1}>
                <Descriptions.Item label="Status">{status.value || '-'}</Descriptions.Item>
                <Descriptions.Item label="Update Times">{lines.value.length}</Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </Flex>
  )
});
</script>
