<script setup lang="tsx">
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import { ThoughtChain, useXAgent, type ThoughtChainItem } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXUseXAgentPreset' });

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com';
const PATH = '/chat';
const MODEL = 'gpt-3.5-turbo';
/** 🔥🔥 Its dangerously! */
// const API_KEY = '';

interface YourMessageType {
  role: string;
  content: string;
}

const status = ref<ThoughtChainItem['status']>();
const lines = ref<Record<string, string>[]>([]);

const [ agent ] = useXAgent<YourMessageType>({
  baseURL: BASE_URL + PATH,
  model: MODEL,
  // dangerouslyApiKey: API_KEY
});

async function request() {
  status.value = 'pending';

  agent.value.request(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
    },
    {
      onSuccess: (chunks) => {
        status.value = 'success';
        console.log('onSuccess', chunks);
      },
      onError: (error) => {
        status.value = 'error';
        console.error('onError', error);
      },
      onUpdate: (chunk) => {
        lines.value = [...lines.value, chunk];
        console.log('onUpdate', chunk);
      },
    },
  );
}

defineRender(() => {
  return (
    <Flex align="start" gap={16} style={{ overflow: 'auto' }}>
      <div>
        <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
          Agent Request
        </Button>
      </div>
      <div>
        <ThoughtChain
          style={{ marginLeft: 16 }}
          items={[
            {
              title: 'Agent Request Log',
              status: status.value,
              icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status.value === 'error' &&
                agent.value.config.baseURL === BASE_URL + PATH &&
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
      </div>
    </Flex>
  )
});
</script>
