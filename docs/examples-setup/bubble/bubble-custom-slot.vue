<script setup lang="ts">
import {
  FrownOutlined,
  SmileOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { BubbleList } from 'ant-design-x-vue';
import { Avatar, Button, Flex, Space, Spin } from 'ant-design-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXBubbleBubbleCustomSlotSetup' });

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
      marginInlineEnd: '44px',
    },
    styles: {
      footer: {
        width: '100%',
      },
    },
  },
  user: {
    placement: 'end',
  },
};

// const listRef = useTemplateRef<InstanceType<typeof BubbleList>>(null);
const listRef = ref<InstanceType<typeof BubbleList>>(null);
</script>

<template>
  <BubbleList
    ref="listRef"
    :style="{ maxHeight: '300px' }"
    :roles="roles"
    :items="[
      {
        key: 'welcome',
        role: 'ai',
        content: 'Mock welcome content. '.repeat(10),
      },
      {
        key: 'ask',
        role: 'user',
        content: 'Mock user content.',
      },
      {
        key: 'ai',
        role: 'ai',
        loading: true,
      },
    ]"
  >
    <template #loading="{ item }">
      <Space v-if="item.role === 'ai'">
        <Spin size="small" />
        Custom loading...
      </Space>
    </template>
    <template #avatar="{ item }">
      <Avatar
        v-if="item.role === 'ai'"
        :style="{ background: '#fde3cf' }"
      >
        <template #icon>
          <UserOutlined />
        </template>
      </Avatar>
      <Avatar
        v-if="item.role === 'user'"
        :style="{ background: '#87d068' }"
      >
        <template #icon>
          <UserOutlined />
        </template>
      </Avatar>
    </template>
    <template #footer="{ item }">
      <Flex v-if="item.key === 'welcome'">
        <Button
          size="small"
          type="text"
          style="margin-inline-end: auto;"
        >
          <template #icon>
            <SyncOutlined />
          </template>
        </Button>
        <Button
          size="small"
          type="text"
        >
          <template #icon>
            <SmileOutlined />
          </template>
        </Button>
        <Button
          size="small"
          type="text"
        >
          <template #icon>
            <FrownOutlined />
          </template>
        </Button>
      </Flex>
    </template>
    <template #header="{ item }">
      <div style="color: #999; font-size: 12px; text-align: center;">
        Custom Header {{ item.role }}
      </div>
    </template>
    <template #message="{ item }">
      {{ item.role }}: {{ item.content }}
    </template>
  </BubbleList>
</template>
