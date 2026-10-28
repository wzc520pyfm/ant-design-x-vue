<script setup lang="tsx">
defineOptions({ name: 'AXSdkXStreamV2' });

import { ref } from 'vue';
import { Button, Flex } from 'ant-design-vue';
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

defineRender(() => (
  <Flex vertical gap={12}>
    <Button type="primary" onClick={read}>Read local SSE</Button>
    <pre style={{ whiteSpace: 'pre-wrap' }}>{lines.value.join('\n') || 'No chunks yet.'}</pre>
  </Flex>
));
</script>
