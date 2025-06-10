<script setup lang="ts">
import { DeleteOutlined, EditOutlined, PlusSquareOutlined, StopOutlined } from '@ant-design/icons-vue';
import { Conversations, theme, type ConversationsProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXConversationsMenuTriggerSetup' });

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const { token } = theme.useToken();

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
};

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  trigger: (menuInfo) => h(
    PlusSquareOutlined,
    {
      onClick: () => {
        console.log(`Click ${conversation.key} - ${menuInfo.key}`);
      } 
    }
  ),
  items: [
    {
      label: 'Operation 1',
      key: 'operation1',
      icon: h(EditOutlined),
    },
    {
      label: 'Operation 2',
      key: 'operation2',
      icon: h(StopOutlined),
      disabled: true,
    },
    {
      label: 'Operation 3',
      key: 'operation3',
      icon: h(DeleteOutlined),
      danger: true,
    },
  ],
  onClick: (menuInfo) => {
    menuInfo.domEvent.stopPropagation();
    console.log(`Click ${conversation.key} - ${menuInfo.key}`);
  },
});
</script>
<template>
  <Conversations
    default-active-key="item1"
    :menu="menuConfig"
    :items="items"
    :style="style"
  />
</template>
