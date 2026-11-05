<script setup lang="ts">
defineOptions({ name: 'AXConversationsCustomNewChatV2Setup' });

import {
  AppstoreAddOutlined,
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';
import { ref, computed, h } from 'vue';

const agentItems: ConversationsProps['items'] = [
  {
    key: 'write',
    label: 'Help Me Write',
    icon: h(CodeOutlined),
  },
  {
    key: 'coding',
    label: 'AI Coding',
    icon: h(CodeOutlined),
  },
  {
    key: 'createImage',
    label: 'Create Image',
    icon: h(FileImageOutlined),
  },
  {
    key: 'deepSearch',
    label: 'Deep Search',
    icon: h(FileSearchOutlined),
  },
  {
    type: 'divider',
  },
];

const historicalItems = ref<ConversationsProps['items']>([
  {
    key: 'item1',
    label: 'Conversation Item 1',
    group: 'Today',
  },
]);

const items = computed(() => [...agentItems!, ...historicalItems.value!]);

const { token } = theme.useToken();

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const newChatClick = () => {
  historicalItems.value = [
    ...historicalItems.value!,
    {
      key: `item${historicalItems.value!.length + 1}`,
      label: `Conversation Item ${historicalItems.value!.length + 1}`,
      group: 'Today',
    },
  ];
};

const creation = computed(() => ({
  label: 'Create a new chat',
  align: 'start' as const,
  icon: h(AppstoreAddOutlined),
  onClick: newChatClick,
}));
</script>

<template>
  <Conversations
    :creation="creation"
    :items="items"
    default-active-key="write"
    :style="style"
    groupable
  />
</template>
