<script setup lang="ts">
defineOptions({ name: 'AXThoughtChainDestroyOnHiddenV2Setup' });

import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Button, Card, Space, Switch } from 'ant-design-vue';
import { computed, ref } from 'vue';

const expandedKeys = ref<string[]>(['task1']);
const destroyOnHidden = ref(true);

const items = computed<ThoughtChainProps['items']>(() => [
  {
    key: 'task1',
    title: 'Collapsible Task',
    description: 'Content will be removed from DOM when collapsed',
    collapsible: true,
    destroyOnHidden: destroyOnHidden.value,
    content: 'Task detail content.',
  },
  {
    key: 'task2',
    title: 'Normal Task',
    content: 'Task2 content.',
  },
]);

const toggleTask1 = () => {
  expandedKeys.value = expandedKeys.value.includes('task1') ? [] : ['task1'];
};
</script>

<template>
  <Card style="width: 500px">
    <Space style="margin-bottom: 16px">
      <Button @click="toggleTask1">
        {{ expandedKeys.includes('task1') ? 'Collapse' : 'Expand' }}
      </Button>
      <Switch
        v-model:checked="destroyOnHidden"
        checked-children="destroyOnHidden"
        un-checked-children="keep"
      />
    </Space>
    <ThoughtChain
      :items="items"
      :expanded-keys="expandedKeys"
      @expand="(keys: string[]) => { expandedKeys = keys; }"
    />
  </Card>
</template>
