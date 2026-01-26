<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble, type BubbleProps } from 'ant-design-x-vue';

const text = 'Ant Design X - Better UI toolkit for your AI Chat WebApp. '.repeat(5);

// 模拟流式内容
const streamContent = ref('');
const isDone = ref(true);
let timer: number | null = null;

const startStream = (content: string, step: number, interval: number) => {
  isDone.value = false;
  streamContent.value = '';
  let currentLength = 0;

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    currentLength += step;
    if (currentLength <= content.length - 1) {
      streamContent.value = content.slice(0, currentLength);
    } else {
      streamContent.value = content;
      isDone.value = true;
      if (timer) clearInterval(timer);
    }
  }, interval) as any;
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const loading = ref(true);
const data = ref('');
const typing = ref(false);
const disableStreaming = ref(false);
const count = ref(0);

const typingConfig: BubbleProps['typing'] = {
  effect: 'typing',
  step: 5,
  interval: 50,
  keepPrefix: true,
};

const loadStream = (step: number, interval: number) => {
  loading.value = false;
  count.value = 0;
  const newText = `${(Math.random() * 10).toFixed(0)} - ${text}`;
  data.value = newText;
  startStream(newText, step, interval);
};

const handleClear = () => {
  data.value = '';
  streamContent.value = '';
  isDone.value = true;
  if (timer) clearInterval(timer);
};

const handleTypingComplete = () => {
  count.value++;
  console.log('typing complete');
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-flex gap="small" align="center">
      <span>流式数据 / steaming data:</span>
      <a-button type="primary" @click="loadStream(2, 100)">load slowly</a-button>
      <a-button @click="loadStream(10, 50)">load quickly</a-button>
      <a-button type="link" @click="handleClear">clear</a-button>
    </a-flex>
    <a-flex gap="small" align="center">
      <span>强制关闭流式标志 / Force close the streaming flag: </span>
      <a-switch v-model:checked="disableStreaming" />
    </a-flex>
    <a-flex gap="small" align="center">
      <span>启用动画 / Enable animation:</span>
      <a-switch v-model:checked="typing" />
    </a-flex>
    <a-flex gap="small" align="center">
      <span>
        onTypingComplete 触发次数 / trigger times:
        <a-typography-text type="danger">{{ count }}</a-typography-text>
      </span>
    </a-flex>
    <a-divider />
    <a-flex gap="small" align="center">
      <Bubble
        :loading="loading"
        :content="streamContent"
        :streaming="disableStreaming ? false : !isDone"
        :typing="typing ? typingConfig : false"
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
      </Bubble>
    </a-flex>
  </a-flex>
</template>
