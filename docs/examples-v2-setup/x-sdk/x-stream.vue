<script setup lang="ts">
defineOptions({ name: 'AXSdkXStreamV2Setup' });

import { ref } from 'vue';
import { XStream } from 'ant-design-x-vue';

const lines = ref<string[]>([]);

async function read() {
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('event: message\ndata: {"text":"hello"}\n\n'));
      controller.enqueue(encoder.encode('event: message\ndata: {"text":"world"}\n\n'));
      controller.close();
    },
  });
  const next: string[] = [];
  for await (const chunk of XStream({ readableStream })) {
    next.push(JSON.stringify(chunk));
  }
  lines.value = next;
}
</script>

<template>
  <a-flex vertical :gap="12">
    <a-button type="primary" @click="read">Read local SSE</a-button>
    <pre style="white-space: pre-wrap">{{ lines.join('\n') || 'No chunks yet.' }}</pre>
  </a-flex>
</template>
