<script setup lang="ts">
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';

const items: ThoughtChainProps['items'] = [
  {
    title: 'Knowledge Query',
    description: 'Query knowledge base',
  },
  {
    title: 'Web Search Tool Invoked',
    description: 'Tool invocation',
  },
  {
    title: 'Model Invocation Complete',
    description: 'Invoke model for response',
  },
  {
    title: 'Response Complete',
    description: 'Task completed',
    blink: true,
  },
];
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <ThoughtChain :items="items" />
  </a-card>
</template>
