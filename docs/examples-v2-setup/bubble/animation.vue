<script setup lang="ts">
defineOptions({ name: 'AXBubbleAnimationV2Setup' });

import { ref } from 'vue';
import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';

const text = 'Ant Design X - Better UI toolkit for your AI Chat WebApp. '.repeat(5);
const text2 = 'Ant Design X - Build your AI Chat WebApp with an easier way. '.repeat(5);

const actionItems = [
  {
    key: 'retry',
    icon: RedoOutlined,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: CopyOutlined,
    label: 'Copy',
  },
];

const loading = ref(true);
const data = ref('');
const effect = ref<'fade-in' | 'typing'>('fade-in');
const keepPrefix = ref(false);

const loadAll = () => {
  loading.value = false;
  data.value = text;
};

const replaceText = () => {
  loading.value = false;
  data.value = text2;
};

const handleTyping = () => {
  console.log('typing');
};

const handleTypingComplete = () => {
  console.log('typing complete');
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-flex gap="small" align="center">
      <span>非流式数据 / Non-streaming data:</span>
      <a-button type="primary" @click="loadAll">load data-1</a-button>
      <a-button @click="replaceText">load data-2</a-button>
    </a-flex>
    <a-flex gap="small" align="center">
      <span>动画效果 / Animation effects:</span>
      <a-radio-group v-model:value="effect">
        <a-radio-button value="fade-in">fade-in</a-radio-button>
        <a-radio-button value="typing">typing</a-radio-button>
      </a-radio-group>
    </a-flex>
    <a-flex gap="small" align="center">
      <span>保留公共前缀 / Preserve common prefix:</span>
      <a-switch v-model:checked="keepPrefix" />
    </a-flex>
    <a-divider />
    <a-flex gap="small" align="center">
      <Bubble
        :loading="loading"
        :content="data"
        :typing="{ effect, interval: 50, step: 3, keepPrefix }"
        @typing="handleTyping"
        @typing-complete="handleTypingComplete"
      >
        <template #avatar>
          <a-avatar>
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </template>
        <template #header>
          <h5>ADX</h5>
        </template>
        <template #footer="{ content }">
          <Actions :items="actionItems" @click="console.log(content)" />
        </template>
      </Bubble>
    </a-flex>
  </a-flex>
</template>
