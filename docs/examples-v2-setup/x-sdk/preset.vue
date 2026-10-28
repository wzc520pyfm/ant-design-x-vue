<script setup lang="ts">
defineOptions({ name: 'AXSdkPresetV2Setup' });

import { Bubble, Sender } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { h } from 'vue';
import { useMockChat } from '../_shared/use-mock-chat';

const chat = useMockChat();
const roles = {
  user: { placement: 'end' as const },
  ai: {
    placement: 'start' as const,
    contentRender: (content: string) => h(XMarkdown, { content }),
  },
};
</script>

<template>
  <a-flex vertical :gap="12">
    <Bubble.List style="height: 280px" :items="chat.bubbles.value" :roles="roles" />
    <Sender
      :value="chat.input.value"
      :loading="chat.isRequesting.value"
      placeholder="Ask the local mock"
      @update:value="(value) => chat.input.value = value"
      :on-submit="() => chat.send()"
      :on-cancel="() => chat.abort()"
    />
  </a-flex>
</template>
