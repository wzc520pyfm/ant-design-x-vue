<script setup lang="ts">
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXThoughtChainStatusSetup' });

function getStatusIcon(status: ThoughtChainItem['status']) {
  switch (status) {
    case 'success':
      return h(CheckCircleOutlined);
    case 'error':
      return h(InfoCircleOutlined);
    case 'pending':
      return h(LoadingOutlined);
    default:
      return undefined;
  }
}

const mockServerResponseData: ThoughtChainItem[] = [
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

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
};

function addChainItem() {
  mockServerResponseData.push({
    title: `Thought Chain Item - ${mockServerResponseData.length + 1}`,
    status: 'pending',
    icon: getStatusIcon('pending'),
    description: 'status: pending',
  });
}

async function updateChainItem(status: ThoughtChainItem['status']) {
  await delay(800);
  mockServerResponseData[mockServerResponseData.length - 1].status = status;
  mockServerResponseData[mockServerResponseData.length - 1].icon =
    getStatusIcon(status);
  mockServerResponseData[
    mockServerResponseData.length - 1
  ].description = `status: ${status}`;
}

const items = ref<ThoughtChainItem[]>(mockServerResponseData);
const loading = ref(false);

const mockStatusChange = async () => {
  await updateChainItem('error');
  items.value = [...mockServerResponseData];
  await updateChainItem('pending');
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
</script>
<template>
  <Card :style="{ width: '500px' }">
    <Button
      :loading="loading"
      :style="{ marginBottom: '16px' }"
      @click="onClick"
    >
      <span v-if="loading">Running</span>
      <span v-else>Run Next</span>
    </Button>
    <ThoughtChain :items="items" />
  </Card>
</template>
