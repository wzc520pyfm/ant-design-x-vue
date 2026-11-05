<script setup lang="ts">
import { h } from 'vue';
import { CodeOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Flex, Typography } from 'ant-design-vue';

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Write New Component',
    description: 'Execute files needed for creating new component',
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
    status: 'success',
  },
  {
    key: 'check_task',
    title: 'Checking Task Execution Steps',
    description: 'Verify overall task execution logic and feasibility',
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'Folder created', description: 'component' }),
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File created', description: 'component/index.tsx' }),
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File created', description: 'component/index.zh-CN.md' }),
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File created', description: 'component/index.en-US.md' }),
    ]),
    status: 'loading',
  },
];
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <ThoughtChain :defaultExpandedKeys="['create_task']" :items="items" />
  </a-card>
</template>
