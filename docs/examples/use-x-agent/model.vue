<script lang="tsx" setup>
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex, Input, Typography } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, useXAgent } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXUseXAgentModel' });

const { Paragraph } = Typography;

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_deepseekv3';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'deepseek-ai/DeepSeek-V3';

/**
 * 🔔 the API_KEY is a placeholder indicator interface that has a built-in real API_KEY
 */

const API_KEY = 'Bearer sk-xxxxxxxxxxxxxxxxxxxx';

interface YourMessageType {
  role: string;
  content: string;
}

const status = ref<string>('');
const thoughtChainStatus = ref<ThoughtChainItem['status']>();
const lines = ref<any[]>([]);
const abortController = ref<AbortController>(null);
const questionText = ref<string>('hello, who are u?');

const [agent] = useXAgent<YourMessageType>({
  baseURL: BASE_URL,
  model: MODEL,
  dangerouslyApiKey: API_KEY,
  /** 🔥🔥 Its dangerously! */
});

const request = () => {
  lines.value = [];
  thoughtChainStatus.value = 'pending';
  status.value = 'pending';
  agent.value.request(
    {
      messages: [{ role: 'user', content: questionText.value }],
      stream: true,
    },
    {
      onSuccess: () => {
        status.value = 'success';
        thoughtChainStatus.value = 'success';
      },
      onError: (error) => {
        if (error.name === 'AbortError') {
          status.value = 'abort';
        }
        thoughtChainStatus.value = 'error';
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg];
      },
      onStream: (controller) => {
        abortController.value = controller;
      },
    },
    new TransformStream<string, any>({
      transform(chunk, controller) {
        const DEFAULT_KV_SEPARATOR = 'data: ';
        const separatorIndex = chunk.indexOf(DEFAULT_KV_SEPARATOR);
        const value = chunk.slice(separatorIndex + DEFAULT_KV_SEPARATOR.length);
        try {
          const modalMessage = JSON.parse(value);
          const content =
            modalMessage?.choices?.[0].delta?.reasoning_content === null
              ? ''
              : modalMessage?.choices?.[0].delta?.reasoning_content;
          controller.enqueue(content);
        } catch (error) {
          controller.enqueue('');
        }
      },
    }),
  );
};

const abort = () => {
  abortController.value?.abort?.();
};

defineRender(() => {
  return (
    <Flex gap={24}>
      <Flex vertical gap={24} style={{ maxWidth: '60%' }}>
        <Flex gap="large" vertical>
          <Input
            value={questionText.value}
            onChange={(e) => {
              questionText.value = e.target.value;
            }}
          />
          <Flex gap="small">
            <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
              Agent Request
            </Button>
            <Button type="primary" disabled={status.value !== 'pending'} onClick={abort}>
              Agent Abort
            </Button>
          </Flex>
        </Flex>
        <Paragraph>{lines.value.length > 0 && lines.value.join('')}</Paragraph>
      </Flex>
      <ThoughtChain
        style={{ marginLeft: '16px' }}
        items={[
          {
            title: 'Agent Request Log',
            status: thoughtChainStatus.value,
            icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
            description: `request ${status.value}`,
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
