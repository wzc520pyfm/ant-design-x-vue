<script setup lang="ts">
import { h } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainBasic' });

const items: ThoughtChainProps['items'] = [
  {
    title: 'Thought Chain Item Title',
    description: 'Description of the thought chain item',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
  {
    title: 'Visible tooltip： Thought Chain Item Title',
    description: 'Description of the thought chain item',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    tooltip: true,
  },
  {
    title: 'Thought Chain Item Title',
    description: 'Description of the thought chain item',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    tooltip: {
      titleConfig: {
        title: 'Custom title tooltip',
      },
      descriptionConfig: {
        title: 'Custom description tooltip',
      },
    },
  },
  {
    title: 'Hidden description tooltip',
    description: 'Description of the thought chain item',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    tooltip: {
      descriptionConfig: {
        open: false,
        title: 'This text does not display the description tooltip',
      },
    },
  },
];
</script>
<template>
  <Card style="width: 250px">
    <ThoughtChain :items="items" />
  </Card>
</template>
