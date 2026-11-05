<script setup lang="tsx">
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainItemType } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Button, Card } from 'ant-design-vue';
import { ref } from 'vue';

function getStatusIcon(status: ThoughtChainItemType['status']) {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined />;
    case 'error':
      return <InfoCircleOutlined />;
    case 'loading':
      return <LoadingOutlined />;
    default:
      return undefined;
  }
}

const mockServerResponseData: ThoughtChainItemType[] = [
  {
    title: 'Thought Chain Item - 1',
    status: 'success',
    description: 'status: success',
    icon: getStatusIcon('success'),
  },
  {
    title: 'Thought Chain Item - 2',
    status: 'error',
    description: 'status: error',
    icon: getStatusIcon('error'),
  },
];

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function addChainItem() {
  mockServerResponseData.push({
    title: `Thought Chain Item - ${mockServerResponseData.length + 1}`,
    status: 'loading',
    icon: getStatusIcon('loading'),
    description: 'status: loading',
  });
}

async function updateChainItem(status: ThoughtChainItemType['status']) {
  await delay(800);
  const last = mockServerResponseData[mockServerResponseData.length - 1];
  last.status = status;
  last.icon = getStatusIcon(status);
  last.description = `status: ${status}`;
}

const items = ref<ThoughtChainItemType[]>([...mockServerResponseData]);
const loading = ref(false);

const mockStatusChange = async () => {
  await updateChainItem('error');
  items.value = [...mockServerResponseData];
  await updateChainItem('loading');
  items.value = [...mockServerResponseData];
  await updateChainItem('success');
  items.value = [...mockServerResponseData];
};

const onClick = async () => {
  loading.value = true;
  addChainItem();
  items.value = [...mockServerResponseData];
  await mockStatusChange();
  loading.value = false;
};

defineRender(() => (
  <Card style={{ width: '500px' }}>
    <Button onClick={onClick} style={{ marginBottom: '16px' }} loading={loading.value}>
      {loading.value ? 'Running' : 'Run Next'}
    </Button>
    <ThoughtChain items={items.value} />
  </Card>
));
</script>
