<script setup lang="ts">
import { h } from 'vue';
import { CodeOutlined, EditOutlined, HeartTwoTone, SmileTwoTone } from '@ant-design/icons-vue';
import type { ThoughtChainItemType } from 'ant-design-x-vue';
import { Think, ThoughtChain } from 'ant-design-x-vue';
import { Button, Flex, Typography } from 'ant-design-vue';

const items: ThoughtChainItemType[] = [
  {
    title: 'Create Task',
    description: 'description',
    icon: h(HeartTwoTone, { twoToneColor: '#eb2f96' }),
    footer: h(Button, { block: true }, () => 'Thought Chain Item Footer'),
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(Think, { title: 'Thinking Process' }, () => '1. Analyze task, understand task workflow\n2. Task creation, files needed for task\n3. Task execution, using new component'),
      h(Typography.Text, { type: 'secondary' }, () => 'Creating folder for new component'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(CodeOutlined), title: 'Executing command', description: 'mkdir -p component' }),
      h(Typography.Text, { type: 'secondary' }, () => 'Creating files needed for new component'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(EditOutlined), title: 'Creating file', description: 'component/index.tsx' }),
    ]),
  },
  {
    key: 'check_task',
    title: 'Check Task Execution Steps Completion',
    icon: h(SmileTwoTone),
    collapsible: true,
    description: 'Verify the overall task execution logic and feasibility',
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'Folder creation completed', description: 'component' }),
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File creation completed', description: 'component/index.tsx' }),
    ]),
  },
  {
    key: 'used_task',
    title: 'Checking Task Execution Steps',
    description: 'Verify the overall task execution logic and feasibility',
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'Folder creation completed', description: 'component' }),
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File creation completed', description: 'component/index.tsx' }),
    ]),
    status: 'error',
  },
];
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <ThoughtChain :items="items" line="dashed" />
  </a-card>
</template>
