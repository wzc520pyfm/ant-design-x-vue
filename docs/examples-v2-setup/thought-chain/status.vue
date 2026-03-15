<script setup lang="ts">
import { h, ref } from 'vue';
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainItemType } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';

function getStatusIcon(status: ThoughtChainItemType['status']) {
  switch (status) {
    case 'success':
      return h(CheckCircleOutlined);
    case 'error':
      return h(InfoCircleOutlined);
    case 'loading':
      return h(LoadingOutlined);
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
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <a-button @click="onClick" :style="{ marginBottom: '16px' }" :loading="loading">
      {{ loading ? 'Running' : 'Run Next' }}
    </a-button>
    <ThoughtChain :items="items" />
  </a-card>
</template>
