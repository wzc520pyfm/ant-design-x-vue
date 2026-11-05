<script setup lang="ts">
defineOptions({ name: 'AXSdkConversationsV2Setup' });

import { computed } from 'vue';
import { theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';

const chat = useMockChat();
const { token } = theme.useToken();
const listStyle = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));
</script>

<template>
  <a-flex vertical gap="small" align="flex-start" style="width: 256px">
    <a-button type="primary" style="align-self: flex-start; width: fit-content" @click="chat.addChat()">New chat</a-button>
    <Conversations
      :style="listStyle"
      :items="chat.conversations.value"
      :active-key="chat.activeConversationKey.value"
      :on-active-change="chat.setActiveConversationKey"
    />
  </a-flex>
</template>
