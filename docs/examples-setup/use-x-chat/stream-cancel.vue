<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Flex } from 'ant-design-vue';
import { Bubble, Sender, useXAgent, useXChat, XStream, type BubbleListProps } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watchEffect } from 'vue';

defineOptions({ name: 'AXUseXChatStreamCancelSetup' });

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: UserOutlined, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    avatar: { icon: UserOutlined, style: { background: '#87d068' } },
  },
};

const contentChunks = [
  'He',
  'llo',
  ', w',
  'or',
  'ld!',
  ' Ant',
  ' Design',
  ' X',
  ' is',
  ' the',
  ' best',
  '!',
];

function mockReadableStream() {
  const sseChunks: string[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    const sseEventPart = `event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n`;
    sseChunks.push(sseEventPart);
  }

  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

const content = ref('');
const senderLoading = ref(false);
const abort = ref(() => { });

watchEffect(() => {
  onWatcherCleanup(() => {
    abort.value();
  })
});

// Agent for request
const [ agent ] = useXAgent({
  request: async (_, { onSuccess, onUpdate }) => {
    senderLoading.value = true;
    const stream = XStream({
      readableStream: mockReadableStream(),
    });

    const reader = stream.getReader();
    abort.value = () => {
      reader?.cancel();
    };

    let current = '';
    while (reader) {
      const { value, done } = await reader.read();
      if (done) {
        senderLoading.value = false;
        onSuccess(current);
        break;
      }
      if (!value) continue;
      const data = JSON.parse(value.data);
      current += data.content || '';
      onUpdate(current);
    }
  },
});

// Chat messages
const { onRequest, messages } = useXChat({
  agent: agent.value,
});
</script>
<template>
  <Flex
    vertical
    gap="middle"
  >
    <Bubble.List
      :roles="roles"
      :style="{ maxHeight: 300 }"
      :items="messages.map(({ id, message, status }) => ({
        key: id,
        role: status === 'local' ? 'local' : 'ai',
        content: message,
      }))"
    />
    <Sender
      :loading="senderLoading"
      :value="content"
      :on-change="(v) => content = v"
      :on-submit="(nextContent) => {
        onRequest(nextContent);
        content = '';
      }"
      :on-cancel="() => abort()"
    />
  </Flex>
</template>
