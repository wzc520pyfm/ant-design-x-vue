<script setup lang="ts">
defineOptions({ name: 'AXConversationsMenuTriggerV2Setup' });

import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import type { MenuProps } from 'ant-design-vue';
import { theme } from 'ant-design-vue';
import { computed, h } from 'vue';

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const menuItems: MenuProps['items'] = [
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
];

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  trigger: conversation.key === 'item2'
    ? h(ShareAltOutlined, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          console.log(`Share ${conversation.key}`);
        },
      })
    : h(PlusSquareOutlined, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
        },
      }),
  items: conversation.key !== 'item2' ? menuItems : [],
  onClick: (itemInfo: any) => {
    console.log(`Click ${conversation.key}-${itemInfo.key}`);
    itemInfo.domEvent.stopPropagation();
  },
});

const { token } = theme.useToken();

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));
</script>

<template>
  <Conversations
    default-active-key="item1"
    :menu="menuConfig"
    :items="items"
    :style="style"
  />
</template>
