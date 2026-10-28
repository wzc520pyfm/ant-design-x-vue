<script setup lang="ts">
defineOptions({ name: 'AXPlaygroundAgentTboxSetup' });

import { computed, h } from 'vue';
import {
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
  XProvider,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';

const chat = useMockChat((question) => `About **${question}**.\n\nLocal Tbox-shaped mock. tbox-nodejs-sdk is Node-only.`);
const prompts = [
  { key: 'what', label: 'What is Tbox?', description: 'Local explanation' },
  { key: 'design', label: 'Design guide', description: 'RICH, in one reply' },
];
const chain = computed(() => [
  { key: 'understand', title: 'Read the question', status: 'success' as const },
  {
    key: 'answer',
    title: chat.isRequesting.value ? 'Drafting' : 'Draft ready',
    status: (chat.isRequesting.value ? 'loading' : 'success') as 'loading' | 'success',
  },
]);
const roles = {
  user: { placement: 'end' as const },
  ai: {
    placement: 'start' as const,
    contentRender: (content: string) => h(XMarkdown, { content }),
  },
};

function onPrompt(info: { data: { label?: string } }) {
  chat.send(String(info.data.label || ''));
}
</script>

<template>
  <XProvider>
    <a-flex style="height: 720px; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden">
      <a-flex vertical :gap="8" style="width: 240px; padding: 12px; background: #fafafa">
        <a-button type="primary" @click="chat.addChat()">New chat</a-button>
        <Conversations
          :items="chat.conversations.value"
          :active-key="chat.activeConversationKey.value"
          :on-active-change="chat.setActiveConversationKey"
        />
      </a-flex>
      <a-flex vertical :gap="12" style="flex: 1; padding: 16px; min-width: 0; overflow: auto">
        <template v-if="chat.bubbles.value.length === 0">
          <Welcome
            title="Ant Design X and Tbox"
            description="Vue layout of the React 2.0 agent playground. Requests stay on this page."
          />
          <Prompts :items="prompts" :on-item-click="onPrompt" />
        </template>
        <Think :title="chat.isRequesting.value ? 'Thinking' : 'Thought'" :loading="chat.isRequesting.value">
          The live Tbox client is not bundled. This block shows where the reasoning panel sits.
        </Think>
        <ThoughtChain :items="chain" />
        <Bubble.List style="min-height: 220px" :items="chat.bubbles.value" :roles="roles" />
        <Sender
          :value="chat.input.value"
          :loading="chat.isRequesting.value"
          placeholder="Ask the local agent"
          @update:value="(value) => chat.input.value = value"
          :on-submit="() => chat.send()"
          :on-cancel="() => chat.abort()"
        />
      </a-flex>
    </a-flex>
  </XProvider>
</template>
