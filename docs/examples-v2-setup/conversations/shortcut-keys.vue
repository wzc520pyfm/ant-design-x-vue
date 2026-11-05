<script setup lang="ts">
defineOptions({ name: 'AXConversationsShortcutKeysV2Setup' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Tag, theme, Typography } from 'ant-design-vue';
import { computed, h, ref } from 'vue';

const KeyK = 75;

const agentItems: ConversationsProps['items'] = [
  { key: 'write', label: 'Help Me Write', icon: h(CodeOutlined) },
  { key: 'coding', label: 'AI Coding', icon: h(CodeOutlined) },
  { key: 'createImage', label: 'Create Image', icon: h(FileImageOutlined) },
  { key: 'deepSearch', label: 'Deep Search', icon: h(FileSearchOutlined) },
];

const historicalItems = ref<NonNullable<ConversationsProps['items']>>([
  { key: 'item1', label: 'Conversation Item 1', group: 'Today' },
]);

const items = computed(() => [...agentItems, ...historicalItems.value]);

const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const newChatClick = () => {
  const next = historicalItems.value.length + 1;
  historicalItems.value = [
    ...historicalItems.value,
    {
      key: `item${next}`,
      label: `Conversation Item ${next}`,
      group: 'Today',
    },
  ];
};
</script>

<template>
  <div>
    <Typography.Paragraph>
      Switch sessions with <Tag>Alt/⌥</Tag> + <Tag>number</Tag>, and create a
      chat with <Tag>Win/⌘</Tag> + <Tag>K</Tag>.
    </Typography.Paragraph>
    <Conversations
      :creation="{ onClick: newChatClick }"
      :items="items"
      default-active-key="write"
      :style="style"
      groupable
      :shortcut-keys="{
        creation: ['Meta', KeyK],
        items: ['Alt', 'number'],
      }"
    />
  </div>
</template>
