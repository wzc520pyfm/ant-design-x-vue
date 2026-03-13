<script setup lang="ts">
defineOptions({ name: 'AXPromptsFlexVerticalV2Setup' });

import { CoffeeOutlined, FireOutlined, SmileOutlined } from '@ant-design/icons-vue';
import { Prompts, type PromptsProps } from 'ant-design-x-vue';
import { h } from 'vue';

const items: PromptsProps['items'] = [
  {
    key: '6',
    icon: h(CoffeeOutlined, { style: { color: '#964B00' } }),
    description: 'How to rest effectively after long hours of work?',
    disabled: false,
  },
  {
    key: '7',
    icon: h(SmileOutlined, { style: { color: '#FAAD14' } }),
    description: 'What are the secrets to maintaining a positive mindset?',
    disabled: false,
  },
  {
    key: '8',
    icon: h(FireOutlined, { style: { color: '#FF4D4F' } }),
    description: 'How to stay calm under immense pressure?',
    disabled: false,
  },
];
</script>

<template>
  <Prompts title="🤔 You might also want to ask:" :items="items" vertical />
</template>
