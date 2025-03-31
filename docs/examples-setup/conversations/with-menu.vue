<script setup lang="ts">
import { DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons-vue';
import { theme, message } from 'ant-design-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { computed, h } from 'vue';

defineOptions({ name: 'AXConversationsWithMenuSetup' });

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const [messageApi, contextHolder] = message.useMessage();
const { token } = theme.useToken();

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
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
    messageApi.info(`Click ${conversation.key} - ${menuInfo.key}`);
  },
});
</script>
<template>
  <contextHolder />
  <Conversations
    default-active-key="item1"
    :menu="menuConfig"
    :items="items"
    :style="style"
  />
</template>
