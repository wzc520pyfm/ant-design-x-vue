<script lang="tsx" setup>
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, useXAgent } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXUseXAgentRequestParams' });

const BASE_URL = 'https://api.example.com/agent';

interface YourMessageType {
  role: string;
  content: string;
}

const status = ref<ThoughtChainItem['status']>();
const lines = ref<any[]>([]);

const [agent] = useXAgent<YourMessageType>({
  baseURL: BASE_URL,
});

async function request() {
  status.value = 'pending';

  agent.value.request(
    {
      agentId: 1234,
      query: 'Search for the latest technology news',
      stream: true,
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
    <Flex>
      <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
        Agent Request
      </Button>
      <ThoughtChain
        style={{ marginLeft: '16px' }}
        items={[
          {
            title: 'Agent Request Log',
            status: status.value,
            icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
            description:
              status.value === 'error' &&
              agent.value.config.baseURL === BASE_URL &&
              'Please replace the BASE_URL,RequestParams with your own values.',
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
  );
});
</script>
