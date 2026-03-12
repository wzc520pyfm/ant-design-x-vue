<script setup lang="ts">
defineOptions({ name: 'AXConversationsControlledCollapsibleV2Setup' });

import { FieldTimeOutlined } from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Flex, theme } from 'ant-design-vue';
import { ref, computed, h } from 'vue';

const groupName = ['Today', 'Yesterday', 'Historical chats'];
const items: ConversationsProps['items'] = Array.from({ length: 9 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  group: groupName[index % 3],
}));

const expandedKeys = ref(['Yesterday']);
const { token } = theme.useToken();

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const groupable = computed<ConversationsProps['groupable']>(() => ({
  label: (group: string) => h(Flex, { gap: 'small' }, () => [h(FieldTimeOutlined), group]),
  collapsible: (group: string) => group !== 'Today',
  expandedKeys: expandedKeys.value,
  onExpand: (keys: string[]) => { expandedKeys.value = keys; },
}));
</script>

<template>
  <Conversations
    :items="items"
    default-active-key="item1"
    :style="style"
    :groupable="groupable"
  />
</template>
