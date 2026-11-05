<script setup lang="ts">
defineOptions({ name: 'AXSdkXConversationsBasicV2Setup' });

import { computed } from 'vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations, useXConversations } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const { conversations } = useXConversations({ defaultConversations: items });
const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <Conversations
      :items="(conversations.value as ConversationsProps['items'])"
      default-active-key="item1"
      :style="style"
    />
  </a-flex>
</template>
