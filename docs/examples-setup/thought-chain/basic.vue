<script setup lang="ts">
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXThoughtChainBasicSetup' });

const items: ThoughtChainProps['items'] = [
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
];
</script>
<template>
  <Card :style="{ width: '500px' }">
    <ThoughtChain :items="items" />
  </Card>
</template>
