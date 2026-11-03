<script setup lang="ts">
defineOptions({ name: 'AXSdkXConversationsMultiInstancesV2Setup' });

import { computed, h, ref } from 'vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
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

const others: ConversationsProps['items'] = Array.from({ length: 2 }).map((_, index) => ({
  key: `other${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const idx = ref(5);
const otherIdx = ref(3);

const handler = useXConversations({
  defaultConversations: items as any,
  defaultActiveConversationKey: items![0].key,
});
const otherHandler = useXConversations({
  defaultConversations: others as any,
  defaultActiveConversationKey: others![0].key,
});

const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

function onAdd(type?: string) {
  const instance = type === 'other' ? otherHandler : handler;
  const n = type === 'other' ? otherIdx.value : idx.value;
  instance.addConversation({
    key: `${type === 'other' ? 'other' : 'item'}${n}`,
    label: `Conversation Item ${n}`,
  });
  if (type === 'other') otherIdx.value += 1;
  else idx.value += 1;
}

function onUpdate(type?: string) {
  const instance = type === 'other' ? otherHandler : handler;
  const realActive =
    type === 'other' ? otherHandler.activeConversationKey.value! : handler.activeConversationKey.value!;
  instance.setConversation(realActive, { key: realActive, label: 'Updated Conversation Item' });
}

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [{ label: 'Delete', key: 'delete', icon: h(DeleteOutlined), danger: true }],
  onClick: () => handler.removeConversation(conversation.key),
});

const otherMenuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [{ label: 'Delete', key: 'delete', icon: h(DeleteOutlined), danger: true }],
  onClick: () => otherHandler.removeConversation(conversation.key),
});
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <a-row :gutter="36">
      <a-col>
        <h3>List 1</h3>
        <Conversations
          :items="(handler.conversations.value as ConversationsProps['items'])"
          :active-key="handler.activeConversationKey.value"
          :style="style"
          :on-active-change="handler.setActiveConversationKey"
          :menu="menuConfig"
        />
        <a-flex gap="small" style="margin-top: 8px">
          <a-button @click="onAdd()">Add</a-button>
          <a-button @click="onUpdate()">Update</a-button>
        </a-flex>
      </a-col>
      <a-col>
        <h3>List 2</h3>
        <Conversations
          :items="(otherHandler.conversations.value as ConversationsProps['items'])"
          :active-key="otherHandler.activeConversationKey.value"
          :style="style"
          :on-active-change="otherHandler.setActiveConversationKey"
          :menu="otherMenuConfig"
        />
        <a-flex gap="small" style="margin-top: 8px">
          <a-button @click="onAdd('other')">Add</a-button>
          <a-button @click="onUpdate('other')">Update</a-button>
        </a-flex>
      </a-col>
    </a-row>
  </a-flex>
</template>
