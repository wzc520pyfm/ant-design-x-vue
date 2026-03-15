<script setup lang="ts">
import { h } from 'vue';
import { EditOutlined, GlobalOutlined, SearchOutlined, ChromeOutlined } from '@ant-design/icons-vue';
import { ThoughtChain } from 'ant-design-x-vue';

const sunIcon = h(ChromeOutlined);
const globalIcon = h(GlobalOutlined);
const editIcon = h(EditOutlined);
const searchIcon = h(SearchOutlined);

const onClick = () => {
  console.log('Item Click');
};
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="small" wrap align="center">
      <a-typography-text>loading status:</a-typography-text>
      <ThoughtChain.Item variant="solid" status="loading" title="Tool Calling" />
      <ThoughtChain.Item variant="outlined" status="loading" title="Tool Calling" />
      <ThoughtChain.Item variant="text" status="loading" title="Tool Calling" />
    </a-flex>

    <a-flex gap="small" wrap align="center">
      <a-typography-text>success status:</a-typography-text>
      <ThoughtChain.Item variant="solid" status="success" title="Tool Call Finished" />
      <ThoughtChain.Item variant="outlined" status="success" title="Tool Call Finished" />
      <ThoughtChain.Item variant="text" status="success" title="Tool Call Finished" />
    </a-flex>

    <a-flex gap="small" wrap align="center">
      <a-typography-text>error status:</a-typography-text>
      <ThoughtChain.Item variant="solid" status="error" title="Tool Call Error" />
      <ThoughtChain.Item variant="outlined" status="error" title="Tool Call Error" />
      <ThoughtChain.Item variant="text" status="error" title="Tool Call Error" />
    </a-flex>

    <a-flex gap="small" wrap align="center">
      <a-typography-text>abort status:</a-typography-text>
      <ThoughtChain.Item variant="solid" status="abort" title="Agent Response Aborted" />
      <ThoughtChain.Item variant="outlined" status="abort" title="Agent Response Aborted" />
      <ThoughtChain.Item variant="text" status="abort" title="Agent Response Aborted" />
    </a-flex>

    <a-flex gap="small" wrap align="center">
      <a-typography-text>custom icon:</a-typography-text>
      <ThoughtChain.Item variant="solid" :icon="sunIcon" title="Task Completed" />
      <ThoughtChain.Item variant="outlined" :icon="sunIcon" title="Task Completed" />
      <ThoughtChain.Item variant="text" :icon="sunIcon" title="Task Completed" />
    </a-flex>

    <a-flex gap="small" wrap align="center">
      <a-typography-text>description & click:</a-typography-text>
      <ThoughtChain.Item
        variant="solid"
        :onClick="onClick"
        :icon="globalIcon"
        title="Opening Webpage"
        description="https://x.ant.design/docs/playground/copilot"
      />
      <ThoughtChain.Item
        variant="outlined"
        :onClick="onClick"
        :icon="editIcon"
        title="Creating"
        description="todo.md"
      />
      <ThoughtChain.Item
        variant="text"
        :onClick="onClick"
        :icon="searchIcon"
        title="Searching"
        description="Route Information"
      />
    </a-flex>

    <a-flex gap="small" wrap align="center">
      <a-typography-text>blink:</a-typography-text>
      <ThoughtChain.Item blink variant="solid" :icon="sunIcon" title="Task Completed" />
      <ThoughtChain.Item blink variant="outlined" :icon="sunIcon" title="Task Completed" />
      <ThoughtChain.Item
        blink
        variant="text"
        :icon="sunIcon"
        title="Task Completed"
        description="Route Information"
      />
    </a-flex>
  </a-flex>
</template>
