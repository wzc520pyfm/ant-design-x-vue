<script setup lang="ts">
defineOptions({ name: 'AXPlaygroundUltramodernSetup' });

import { h } from 'vue';
import { Bubble, Conversations, Sender, XProvider } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';

const chat = useMockChat((question) => `**${question}**\n\nLocal ultramodern mock. No DeepSeek key is sent.`);
const roles = {
  user: { placement: 'end' as const },
  ai: {
    placement: 'start' as const,
    contentRender: (content: string) => h(XMarkdown, { className: 'x-markdown-light', content }),
  },
};
</script>

<template>
  <XProvider>
    <a-flex style="height: 640px; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden">
      <a-flex vertical :gap="8" style="width: 240px; padding: 12px; background: #fafafa">
        <a-button type="primary" @click="chat.addChat()">New chat</a-button>
        <Conversations
          :items="chat.conversations.value"
          :active-key="chat.activeConversationKey.value"
          :on-active-change="chat.setActiveConversationKey"
        />
      </a-flex>
      <a-flex vertical :gap="12" style="flex: 1; padding: 12px; min-width: 0">
        <Bubble.List style="height: 480px" :items="chat.bubbles.value" :roles="roles" />
        <Sender
          :value="chat.input.value"
          :loading="chat.isRequesting.value"
          placeholder="Message"
          @update:value="(value) => chat.input.value = value"
          :on-submit="() => chat.send()"
          :on-cancel="() => chat.abort()"
        />
      </a-flex>
    </a-flex>
  </XProvider>
</template>
