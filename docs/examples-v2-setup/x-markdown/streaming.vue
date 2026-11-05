<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownStreamingV2Setup' });

import { computed, ref } from 'vue';
import { XMarkdown, useStreaming } from '@ant-design-x-vue/x-markdown';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();
const wrapStyle = computed(() => ({
  border: `1px solid ${token.value.colorBorderSecondary}`,
  borderRadius: '4px',
  padding: '16px',
  minHeight: '120px',
}));

const fullContent = `# Streaming Demo

Content appears **progressively**.

- Step 1
- Step 2
- Step 3
`;

const content = ref('');
const streaming = ref(false);
const { status, displayedContent } = useStreaming({
  content,
  streaming,
  onComplete: () => console.log('stream complete'),
});

const startStream = () => {
  content.value = '';
  streaming.value = true;
  let i = 0;
  const timer = setInterval(() => {
    if (i < fullContent.length) {
      content.value = fullContent.slice(0, i + 3);
      i += 3;
    } else {
      streaming.value = false;
      clearInterval(timer);
    }
  }, 50);
};
</script>

<template>
  <a-flex vertical :gap="16">
    <a-space>
      <a-button type="primary" @click="startStream">Start streaming</a-button>
      <span>Status: {{ status }}</span>
    </a-space>
    <div :style="wrapStyle">
      <XMarkdown :content="displayedContent" :streaming="streaming" />
    </div>
  </a-flex>
</template>
