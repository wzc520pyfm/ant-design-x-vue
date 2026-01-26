<script setup lang="ts">
import { AntDesignOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar } from 'ant-design-vue';

const actionItems = [
  {
    key: 'copy',
    label: 'copy',
  },
  {
    key: 'retry',
    icon: RedoOutlined,
    label: 'Retry',
  },
];

const text = `Hello World\nNext line\nTab\tindent`;
</script>

<template>
  <Bubble :content="text" :typing="{ effect: 'fade-in' }">
    <template #header>
      <h5>Ant Design X</h5>
    </template>
    <template #footer="{ content }">
      <Actions :items="actionItems" @click="console.log(content)" />
    </template>
    <template #avatar>
      <Avatar>
        <template #icon>
          <AntDesignOutlined />
        </template>
      </Avatar>
    </template>
  </Bubble>
</template>
