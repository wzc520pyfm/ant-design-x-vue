<script setup lang="ts">
import {
  CoffeeOutlined,
  FireOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Bubble, Prompts, type PromptsProps } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { h } from 'vue';

defineOptions({ name: 'AXBubbleVariantSetup' });

const items: PromptsProps['items'] = [
  {
    key: '6',
    icon: h(CoffeeOutlined, { style: { color: '#964B00' } }),
    description: 'How to rest effectively after long hours of work?',
  },
  {
    key: '7',
    icon: h(SmileOutlined, { style: { color: '#FAAD14' } }),
    description: 'What are the secrets to maintaining a positive mindset?',
  },
  {
    key: '8',
    icon: h(FireOutlined, { style: { color: '#FF4D4F' } }),
    description: 'How to stay calm under immense pressure?',
  },
];
</script>

<template>
  <Flex vertical gap="middle">
    <Bubble
      variant="filled"
      :avatar="{ icon: h(UserOutlined) }"
      content="variant: filled"
    />
    <Bubble
      variant="outlined"
      :avatar="{ icon: h(UserOutlined) }"
      content="variant: outlined"
    />
    <Bubble
      variant="shadow"
      :avatar="{ icon: h(UserOutlined) }"
      content="variant: shadow"
    />
    <Bubble
      variant="borderless"
      :avatar="{ icon: h(UserOutlined) }"
      :content="
        h(Prompts, {
          title: 'variant: borderless to customize',
          items,
          vertical: true,
        })
      "
    />
  </Flex>
</template>
