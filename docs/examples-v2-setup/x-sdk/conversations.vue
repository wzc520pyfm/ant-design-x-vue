<script setup lang="ts">
defineOptions({ name: 'AXSdkConversationsV2Setup' });

import { Conversations } from 'ant-design-x-vue';
import { useMockChat } from '../_shared/use-mock-chat';

const chat = useMockChat();
</script>

<template>
  <a-flex vertical :gap="12">
    <a-button type="primary" @click="chat.addChat()">New chat</a-button>
    <Conversations
      :items="chat.conversations.value"
      :active-key="chat.activeConversationKey.value"
      :on-active-change="chat.setActiveConversationKey"
    />
  </a-flex>
</template>
