<script lang="tsx" setup>
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex, Input, Typography } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, XRequest } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXXRequestModel' });

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

const exampleRequest = XRequest({
  baseURL: BASE_URL,
  model: MODEL,
  dangerouslyApiKey: API_KEY,
  /** 🔥🔥 Its dangerously! */
});

const status = ref<string>();
const thoughtChainStatus = ref<ThoughtChainItem['status']>();
const lines = ref<Record<string, string>[]>([]);
const questionText = ref<string>('hello, who are u?');
const abortController = ref<AbortController>(null);

const request = async () => {
  status.value = 'pending';
  lines.value = [];
  await exampleRequest.value.create(
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
              Request
            </Button>
            <Button type="primary" disabled={status.value !== 'pending'} onClick={abort}>
              Request Abort
            </Button>
          </Flex>
        </Flex>
        <Paragraph>{lines.value.length > 0 && JSON.stringify(lines.value)}</Paragraph>
      </Flex>
      <ThoughtChain
        items={[
          {
            title: 'Request Log',
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
