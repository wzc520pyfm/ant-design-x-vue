<script setup lang="ts">
import { h } from 'vue';
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Button } from 'ant-design-vue';

const items: ThoughtChainProps['items'] = [
  {
    title: '1 - Thought Chain Item',
    description: 'description',
    footer: h(Button, null, () => '1 - Thought Chain Item Footer'),
    content: h(ThoughtChain, {
      items: [
        { title: '1-1 Thought Chain Item', description: 'description' },
        { title: '1-2 Thought Chain Item', description: 'description' },
      ],
    }),
  },
  {
    title: '2 - Thought Chain Item',
    description: 'description',
    footer: h(Button, null, () => '2 - Thought Chain Item Footer'),
    content: h(ThoughtChain, {
      items: [
        { title: '2-1 Thought Chain Item', description: 'description' },
        { title: '2-2 Thought Chain Item', description: 'description' },
        { title: '2-3 Thought Chain Item', description: 'description' },
      ],
    }),
  },
];
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <ThoughtChain :items="items" />
  </a-card>
</template>
