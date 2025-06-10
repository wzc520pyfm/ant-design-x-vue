<script setup lang="ts">
import { cloneVNode, ref, h } from 'vue';
import { Card, CheckboxGroup, Space, Typography } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainControlledSetup' });

const { Paragraph, Text } = Typography;

const mockContent = h(Typography, () => [
  h(
    Paragraph,
    () => `In the process of internal desktop applications development, many
      different design specs and implementations would be involved, which might
      cause designers and developers difficulties and duplication and reduce the
      efficiency of development.`,
  ),
  h(Paragraph, () => [
    `After massive project practice and summaries, Ant Design, a design
      language for background applications, is refined by Ant UED Team, which
      aims to `,
    h(
      Text,
      { strong: true },
      () => `uniform the user interface specs for internal background projects, lower
      the unnecessary cost of design differences and implementation and liberate
      the resources of design and front-end development`,
    ),
  ]),
]);

const expandedKeys = ref(['1']);

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
};

const items: ThoughtChainProps['items'] = [
  {
    key: '1',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: cloneVNode(mockContent),
  },
  {
    key: '2',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: cloneVNode(mockContent),
  },
];
</script>

<template>
  <Card style="width: '500px'">
    <Space
      direction="vertical"
      size="large"
    >
      <CheckboxGroup
        v-model:value="expandedKeys"
        :options="
          items.map((item) => ({
            label: `item ${item.key}`,
            value: item.key,
          }))
        "
      />
      <ThoughtChain
        :items="items"
        :collapsible="{ expandedKeys, onExpand }"
      />
    </Space>
  </Card>
</template>
