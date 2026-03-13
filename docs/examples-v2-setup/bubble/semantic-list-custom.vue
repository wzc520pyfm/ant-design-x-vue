<script setup lang="ts">
defineOptions({ name: 'AXBubbleSemanticListCustomV2Setup' });

import { ref, h } from 'vue';
import { FrownOutlined, SmileOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { Bubble, type RoleType } from 'ant-design-x-vue';

const listRef = ref<InstanceType<typeof Bubble.List> | null>(null);

const roles: RoleType = {
  ai: {
    placement: 'start',
    typing: { effect: 'typing', step: 5, interval: 20 },
    loadingRender: () => h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
      h('a-spin', { size: 'small' }),
      'Custom loading...',
    ]),
  },
  user: {
    placement: 'end',
  },
};

const items = [
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
    content: '',
  },
];
</script>

<template>
  <Bubble.List
    ref="listRef"
    :style="{ height: '500px' }"
    :roles="roles"
    :items="items"
  >
    <template #footer="{ item }">
      <a-flex v-if="item.key === 'welcome'">
        <a-button size="small" type="text" :style="{ marginInlineEnd: 'auto' }">
          <template #icon><SyncOutlined /></template>
        </a-button>
        <a-button size="small" type="text">
          <template #icon><SmileOutlined /></template>
        </a-button>
        <a-button size="small" type="text">
          <template #icon><FrownOutlined /></template>
        </a-button>
      </a-flex>
    </template>
  </Bubble.List>
</template>
