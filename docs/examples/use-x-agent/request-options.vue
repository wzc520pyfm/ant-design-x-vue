<script setup lang="tsx">
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { ThoughtChain, useXAgent } from 'ant-design-x-vue';
import { Button, Descriptions, Flex, Space } from 'ant-design-vue';

import type { ThoughtChainItem } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXUseXAgentRequestOptions' });

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com/chat/v1';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = 'Bearer sk-your-dangerouslyApiKey';
/** 🔥🔥 Its dangerously! */
// const API_KEY = '';

interface YourMessageType {
  role: string;
  content: string;
}

const status = ref<ThoughtChainItem['status']>();
const lines = ref<any[]>([]);
const errorState = ref<Error>();
const requestOptions = ref({
  baseURL: BASE_URL,
  model: MODEL,
  dangerouslyApiKey: API_KEY,
  /** 🔥🔥 Its dangerously! */
  // dangerouslyApiKey: API_KEY
});

const [agent] = useXAgent<YourMessageType>(requestOptions);

const changeBaseData = () => {
  requestOptions.value = {
    baseURL: requestOptions.value.baseURL === BASE_URL ? 'https://api.example.com/chat/v2' : BASE_URL,
    model: requestOptions.value.model === MODEL ? 'gpt-4' : MODEL,
    dangerouslyApiKey:
      requestOptions.value.dangerouslyApiKey === API_KEY ? 'Bearer sk-your-new-dangerouslyApiKey' : API_KEY,
  }
};

async function request() {
  status.value = 'pending';
  agent.value.request(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
    },
    {
      onSuccess: () => {
        status.value = 'success';
      },
      onError: (error) => {
        status.value = 'error';
        errorState.value = error;
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg];
      },
    },
  );
}

defineRender(() => {
  return (
    <Space>
      <Space direction="vertical">
        <Flex gap="small">
          <Button type="primary" disabled={status.value === 'pending'} onClick={changeBaseData}>
            Change Request Options
          </Button>
          <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
            Agent Request
          </Button>
        </Flex>
        <p>baseURL: {requestOptions.value.baseURL}</p>
        <p>model: {requestOptions.value.model}</p>
        <p>dangerouslyApiKey: {requestOptions.value.dangerouslyApiKey}</p>
      </Space>
      <ThoughtChain
        style={{ marginLeft: 16 }}
        items={[
          {
            title: 'Agent Request Log',
            status: status.value,
            icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
            description: status.value === 'error' && (errorState.value?.message || 'request error'),
            content: (
              <Descriptions column={1}>
                <Descriptions.Item label="Status">{status.value || '-'}</Descriptions.Item>
                <Descriptions.Item label="Update Times">{lines.value.length}</Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </Space>
  );
});
</script>
