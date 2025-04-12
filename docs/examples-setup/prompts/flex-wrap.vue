<script setup lang="ts">
import { BulbOutlined, CheckCircleOutlined, CoffeeOutlined, FireOutlined, InfoCircleOutlined, RocketOutlined, SmileOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { Prompts, type PromptsProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXPromptsFlexWrapSetup' });

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: h(BulbOutlined, { style: { color: '#FFD700' } }),
    description: 'Got any sparks for a new project?',
  },
  {
    key: '2',
    icon: h(InfoCircleOutlined, { style: { color: '#1890FF' } }),
    description: 'Help me understand the background of this topic.',
  },
  {
    key: '3',
    icon: h(WarningOutlined, { style: { color: '#FF4D4F' } }),
    description: 'How to solve common issues? Share some tips!',
  },
  {
    key: '4',
    icon: h(RocketOutlined, { style: { color: '#722ED1' } }),
    description: 'How can I work faster and better?',
  },
  {
    key: '5',
    icon: h(CheckCircleOutlined, { style: { color: '#52C41A' } }),
    description: 'What are some tricks for getting tasks done?',
  },
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
  <Prompts title="✨ Inspirational Sparks and Marvelous Tips666" :items="items" wrap />
</template>
