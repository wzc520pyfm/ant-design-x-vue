<script setup lang="ts">
defineOptions({ name: 'AXBubbleBasicV2Setup' });

import { AntDesignOutlined, CopyOutlined, CheckOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar } from 'ant-design-vue';
import { ref, computed, h } from 'vue';

const copiedKey = ref('');

const getActionItems = (content: string) => [
  {
    key: 'copy',
    icon: copiedKey.value === content ? h(CheckOutlined) : h(CopyOutlined),
    label: 'Copy',
    onItemClick: () => {
      navigator.clipboard.writeText(content);
      copiedKey.value = content;
      setTimeout(() => { copiedKey.value = ''; }, 2000);
    },
  },
  {
    key: 'retry',
    icon: h(RedoOutlined),
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
      <Actions :items="getActionItems(content)" @click="console.log(content)" />
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
