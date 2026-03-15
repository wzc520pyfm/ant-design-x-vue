<script setup lang="ts">
import { h } from 'vue';
import { CodeOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Flex, Typography } from 'ant-design-vue';

const contentStyles = {
  backgroundColor: 'rgba(0,0,0,.01)',
  borderRadius: '8px',
  padding: '10px',
  marginBlockStart: '10px',
  border: '1px solid rgba(0,0,0,.04)',
};

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Write New Component',
    icon: false,
    collapsible: true,
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(Typography.Text, { type: 'secondary' }, () => 'Creating folder for new component'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(CodeOutlined), title: 'Executing command', description: 'mkdir -p component' }),
      h(Typography.Text, { type: 'secondary' }, () => 'Creating files needed for new component'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(EditOutlined), title: 'Creating file', description: 'component/index.tsx' }),
      h(Typography.Text, { type: 'secondary' }, () => 'Creating Chinese description file'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(EditOutlined), title: 'Creating file', description: 'component/index.zh-CN.md' }),
      h(Typography.Text, { type: 'secondary' }, () => 'Creating English description file'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(EditOutlined), title: 'Creating file', description: 'component/index.en-US.md' }),
    ]),
  },
];
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <ThoughtChain
      :styles="{ itemContent: contentStyles }"
      :defaultExpandedKeys="['create_task']"
      :items="items"
    />
  </a-card>
</template>
