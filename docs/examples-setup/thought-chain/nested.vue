<script setup lang="ts">
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXThoughtChainNestedSetup' });

const items: ThoughtChainProps['items'] = [
  {
    title: '1 - Thought Chain Item',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    footer: h(Button, {}, () => '1 - Thought Chain Item Footer'),
    content: h(ThoughtChain, {
      items: [
        {
          title: '1-1 Thought Chain Item',
          description: 'description',
          extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
        },
        {
          title: '1-2 Thought Chain Item',
          description: 'description',
          extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
        },
      ],
    }),
  },
  {
    title: '2 - Thought Chain Item',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    footer: h(Button, {}, () => '2 - Thought Chain Item Footer'),
    content: h(ThoughtChain, {
      items: [
        {
          title: '2-1 Thought Chain Item',
          description: 'description',
          extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
        },
        {
          title: '2-2 Thought Chain Item',
          description: 'description',
          extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
        },
      ],
    }),
  },
];
</script>
<template>
  <Card :style="{ width: '500px' }">
    <ThoughtChain
      :items="items"
      collapsible
    />
  </Card>
</template>
