<script setup lang="tsx">
defineOptions({ name: 'AXSdkXStreamDefaultProtocolV2' });

import { computed, ref } from 'vue';
import { TagsOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
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

async function readStream() {
  lines.value = [];
  for await (const chunk of XStream({ readableStream: mockReadableStream() })) {
    lines.value = [...lines.value, chunk as Record<string, string>];
  }
}

defineRender(() => (
  <Flex vertical gap={16}>
    <Button type="primary" style={{ alignSelf: 'flex-start', width: 'fit-content' }} onClick={readStream}>
      Mock Default Protocol - SSE
    </Button>
    {content.value ? <Bubble content={content.value} /> : null}
    <ThoughtChain
      items={
        lines.value.length
          ? [
              {
                key: 'log',
                title: 'Mock Default Protocol - Log',
                status: 'success',
                icon: <TagsOutlined />,
                content: (
                  <pre style={{ overflow: 'auto', margin: 0 }}>
                    {lines.value.map((i) => i.data).join('\n')}
                  </pre>
                ),
              },
            ]
          : []
      }
    />
  </Flex>
));
</script>
