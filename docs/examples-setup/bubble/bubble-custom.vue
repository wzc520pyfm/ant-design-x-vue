<script setup lang="ts">
import {
  FrownOutlined,
  SmileOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { BubbleList } from 'ant-design-x-vue';
import { Button, Flex, Space, Spin } from 'ant-design-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXBubbleBubbleCustomSetup' });

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
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
    loadingRender: () =>
      h(Space, null, () => [h(Spin, { size: 'small' }), 'Custom loading...']),
  },
  user: {
    placement: 'end',
    avatar: { icon: h(UserOutlined), style: { background: '#87d068' } },
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
        footer: h(Flex, null, () => [
          h(Button, {
            size: 'small',
            type: 'text',
            icon: h(SyncOutlined),
            style: { marginInlineEnd: 'auto' },
          }),
          h(Button, { size: 'small', type: 'text', icon: h(SmileOutlined) }),
          h(Button, { size: 'small', type: 'text', icon: h(FrownOutlined) }),
        ]),
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
  />
</template>
