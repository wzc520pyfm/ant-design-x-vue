<script setup lang="ts">
defineOptions({ name: 'AXSdkXConversationsOperationsV2Setup' });

import { computed, h, ref } from 'vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations, useXConversations } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';

const createItems = (): NonNullable<ConversationsProps['items']> =>
  Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label:
      index + 1 === 3
        ? "This's Conversation Item 3, you can click me!"
        : `Conversation Item ${index + 1}`,
    disabled: index === 3,
  }));

const idx = ref(5);
const {
  conversations,
  addConversation,
  activeConversationKey,
  setActiveConversationKey,
  setConversation,
  removeConversation,
  getConversation,
  setConversations,
} = useXConversations({
  defaultConversations: createItems(),
  defaultActiveConversationKey: 'item1',
});

const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const current = computed(() =>
  JSON.stringify(getConversation(activeConversationKey.value!), null, 2),
);

function onAdd() {
  addConversation({ key: `item${idx.value}`, label: `Conversation Item ${idx.value}` });
  idx.value += 1;
}

function onUpdate() {
  setConversation(activeConversationKey.value!, {
    key: activeConversationKey.value!,
    label: 'Updated Conversation Item',
  });
}

function onReset() {
  setConversations(createItems());
  setActiveConversationKey('item1');
}

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [
    {
      label: 'Delete',
      key: 'delete',
      icon: h(DeleteOutlined),
      danger: true,
    },
  ],
  onClick: () => {
    removeConversation(conversation.key);
  },
});
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <Conversations
      :creation="{ onClick: onAdd }"
      :items="(conversations.value as ConversationsProps['items'])"
      :active-key="activeConversationKey"
      :style="style"
      :on-active-change="setActiveConversationKey"
      :menu="menuConfig"
    />
    <a-flex gap="small">
      <a-button @click="onAdd">Add</a-button>
      <a-button @click="onUpdate">Update</a-button>
      <a-button @click="onReset">Reset</a-button>
    </a-flex>
    <a-typography-paragraph>
      Current Conversation Data:
      <pre>{{ current }}</pre>
    </a-typography-paragraph>
  </a-flex>
</template>
