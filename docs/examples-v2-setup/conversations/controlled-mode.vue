<script setup lang="ts">
defineOptions({ name: 'AXConversationsControlledModeV2Setup' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Button, Flex, theme } from 'ant-design-vue';
import { ref, h, computed } from 'vue';

const items: ConversationsProps['items'] = [
  {
    key: 'write',
    label: 'Help Me Write',
    icon: h(CodeOutlined),
  },
  {
    key: 'coding',
    label: 'AI Coding',
    icon: h(CodeOutlined),
  },
  {
    key: 'createImage',
    label: 'Create Image',
    icon: h(FileImageOutlined),
  },
  {
    key: 'deepSearch',
    label: 'Deep Search',
    icon: h(FileSearchOutlined),
  },
];

const activeKey = ref('write');
const { token } = theme.useToken();

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const updateActiveKey = (v: string) => {
  activeKey.value = v;
};
</script>

<template>
  <Flex vertical gap="small" align="flex-start">
    <Conversations
      :active-key="activeKey"
      :on-active-change="updateActiveKey"
      :items="items"
      :style="style"
    />
    <Flex gap="small">
      <Button @click="activeKey = 'write'">Active First</Button>
      <Button @click="activeKey = 'deepSearch'">Active Last</Button>
    </Flex>
  </Flex>
</template>
