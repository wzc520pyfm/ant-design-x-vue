<script setup lang="ts">
import { Card, Typography } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';
import { cloneVNode, h } from 'vue';

defineOptions({ name: 'AXThoughtChainCollapsibleSetup' });

const { Paragraph, Text } = Typography;

// 更推荐将 mockContent 封装成 SFC
const mockContent = h(Typography, {}, () => [
  h(
    Paragraph,
    {},
    () => 'In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the efficiency of development.',
  ),
  h(Paragraph, {}, () => [
    'After massive project practice and summaries, Ant Design, a design language for background applications, is refined by Ant UED Team, which aims to ',
    h(
      Text,
      { strong: true },
      () => 'uniform the user interface specs for internal background projects, lower the unnecessary cost of design differences and implementation and liberate the resources of design and front-end development',
    ),
  ]),
]);

const items: ThoughtChainProps['items'] = [
  {
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: cloneVNode(h(mockContent)),
  },
  {
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: cloneVNode(h(mockContent)),
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
