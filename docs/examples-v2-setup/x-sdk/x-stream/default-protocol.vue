<script setup lang="ts">
defineOptions({ name: 'AXSdkXStreamDefaultProtocolV2Setup' });

import { computed, h, ref } from 'vue';
import { TagsOutlined } from '@ant-design/icons-vue';
import { Bubble, ThoughtChain, XStream } from 'ant-design-x-vue';

const contentChunks = ['He', 'llo', ', w', 'or', 'ld!'];

function mockReadableStream() {
  const sseChunks = contentChunks.map(
    (chunk, i) => `event: message\ndata: {"id":"${i}","content":"${chunk}"}\n\n`,
  );
  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

const lines = ref<Record<string, string>[]>([]);
const content = computed(() =>
  lines.value.map((line) => JSON.parse(line.data).content).join(''),
);

const chainItems = computed(() =>
  lines.value.length
    ? [
        {
          key: 'log',
          title: 'Mock Default Protocol - Log',
          status: 'success' as const,
          icon: h(TagsOutlined),
          content: h(
            'pre',
            { style: { overflow: 'auto', margin: 0 } },
            lines.value.map((i) => i.data).join('\n'),
          ),
        },
      ]
    : [],
);

async function readStream() {
  lines.value = [];
  for await (const chunk of XStream({ readableStream: mockReadableStream() })) {
    lines.value = [...lines.value, chunk as Record<string, string>];
  }
}
</script>

<template>
  <a-flex vertical :gap="16">
    <a-button type="primary" style="align-self: flex-start; width: fit-content" @click="readStream">
      Mock Default Protocol - SSE
    </a-button>
    <Bubble v-if="content" :content="content" />
    <ThoughtChain :items="chainItems" />
  </a-flex>
</template>
