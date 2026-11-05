<script setup lang="ts">
defineOptions({ name: 'AXConversationsBasicV2Setup' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Flex, Switch, theme } from 'ant-design-vue';
import { ref, computed, h } from 'vue';

const { token } = theme.useToken();
const deepSearchChecked = ref(false);

const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const items = computed<ConversationsProps['items']>(() => [
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
    disabled: !deepSearchChecked.value,
    label: h(Flex, { gap: 'small', align: 'center' }, () => [
      'Deep Search',
      h(Switch, {
        size: 'small',
        checked: deepSearchChecked.value,
        onChange: (val: boolean) => { deepSearchChecked.value = val; },
      }),
    ]),
    icon: h(FileSearchOutlined),
  },
]);
</script>

<template>
  <Conversations :items="items" default-active-key="write" :style="style" />
</template>
