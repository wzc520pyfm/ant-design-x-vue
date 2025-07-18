<script lang="tsx" setup>
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, XRequest } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXXRequestRequestParams' });

const BASE_URL = 'https://api.example.com/agent';

const exampleRequest = XRequest({
  baseURL: BASE_URL,
});

interface RequestParams {
  agentId: number;
  query: string;
}

const status = ref<ThoughtChainItem['status']>();
const lines = ref<Record<string, string>[]>([]);

async function request() {
  status.value = 'pending';

  await exampleRequest.value.create<RequestParams>(
    {
      query: 'Search for the latest technology news',
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
    <Flex>
      <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
        Request - {BASE_URL}
      </Button>
      <ThoughtChain
        items={[
          {
            title: 'Request Log',
            status: status.value,
            icon: status.value === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
            description:
              status.value === 'error' &&
              exampleRequest.value.baseURL === BASE_URL &&
              'Please replace the BASE_URL, RequestParams with your own values.',
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
