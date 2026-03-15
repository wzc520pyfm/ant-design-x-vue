<script setup lang="ts">
import { h, ref } from 'vue';
import { CodeOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Flex, Typography } from 'ant-design-vue';

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Develop New Component',
    description: 'Execute files needed for new component creation',
    collapsible: true,
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(Typography.Text, { type: 'secondary' }, () => 'Creating folder for new component'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(CodeOutlined), title: 'Executing command', description: 'mkdir -p component' }),
      h(Typography.Text, { type: 'secondary' }, () => 'Creating files needed for new component'),
      h(ThoughtChain.Item, { variant: 'solid', icon: h(EditOutlined), title: 'Creating file', description: 'component/index.tsx' }),
    ]),
    status: 'success',
  },
  {
    key: 'check_task',
    title: 'Check Task Execution Steps Completion',
    collapsible: true,
    description: 'Verify the overall task execution logic and feasibility',
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'Folder created', description: 'component' }),
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File created', description: 'component/index.tsx' }),
    ]),
    status: 'success',
  },
  {
    key: 'used_task',
    title: 'Using the New Component',
    description: 'Using the generated component to complete the task',
    content: h(Flex, { gap: 'small', vertical: true }, () => [
      h(ThoughtChain.Item, { variant: 'solid', status: 'success', title: 'File created', description: 'component' }),
    ]),
    status: 'loading',
  },
];

const expandedKeys = ref(['create_task']);

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
};
</script>

<template>
  <a-card :style="{ width: '500px' }">
    <a-button :style="{ marginBottom: '16px' }" @click="expandedKeys = ['check_task']">
      Open "check_task" details
    </a-button>
    <ThoughtChain
      :items="items"
      :expandedKeys="expandedKeys"
      :onExpand="onExpand"
    />
  </a-card>
</template>
