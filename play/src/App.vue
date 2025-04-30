<script setup lang="ts">
import { h } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainBasic' });

const items: ThoughtChainProps['items'] = [
  {
    title: '显示 tooltip',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    tooltip: true,
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    tooltip: {
      titleConfig: {
        title: '自定义 Tooltip 标题',
      },
      descriptionConfig: {
        title: '自定义 Tooltip 副标题',
      },
    },
  },
  {
    title: '配置不显示 description',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
    tooltip: {
      descriptionConfig: {
        open: false,
        title: '配置不显示 description ',
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
