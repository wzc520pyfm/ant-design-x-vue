<script setup lang="ts">
import { Button, Flex, theme } from 'ant-design-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXConversationsControlledModeSetup' });


const items: ConversationsProps['items'] = Array.from({ length: 3 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
}));

const activeKey = ref('item1');
const updateActiveKey = (v: string) => activeKey.value = v;
const { token } = theme.useToken();

// Customize the style of the container
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));
</script>
<template>
  <Flex
    vertical
    gap="small"
    align="flex-start"
  >
    <Conversations
      :active-key="activeKey"
      :on-active-change="(v) => updateActiveKey(v)"
      :items="items"
      :style="style"
    />

    <Flex gap="small">
      <Button
        @click="() => {
          updateActiveKey('item1');
        }"
      >
        Active First
      </Button>
      <Button
        @click="() => {
          updateActiveKey('item3');
        }"
      >
        Active Last
      </Button>
    </Flex>
  </Flex>
</template>
