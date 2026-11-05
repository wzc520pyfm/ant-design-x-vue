<script setup lang="ts">
defineOptions({ name: 'AXConversationsWithMenuV2Setup' });

import {
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';
import { computed, h } from 'vue';

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const { token } = theme.useToken();

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const menuConfig: ConversationsProps['menu'] = {
  items: [
    {
      label: 'Rename',
      key: 'Rename',
      icon: h(EditOutlined),
    },
    {
      label: 'Share',
      key: 'Share',
      icon: h(ShareAltOutlined),
    },
    {
      type: 'divider',
    },
    {
      label: 'Archive',
      key: 'Archive',
      icon: h(StopOutlined),
      disabled: true,
    },
    {
      label: 'Delete Chat',
      key: 'deleteChat',
      icon: h(DeleteOutlined),
      danger: true,
    },
  ],
  onClick: (itemInfo) => {
    console.log(`Click ${itemInfo.key}`);
    itemInfo.domEvent.stopPropagation();
  },
};
</script>

<template>
  <Conversations
    default-active-key="item1"
    :menu="menuConfig"
    :items="items"
    :style="style"
  />
</template>
