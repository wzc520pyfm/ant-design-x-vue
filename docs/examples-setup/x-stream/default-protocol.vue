<script setup lang="ts">
import { TagsOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
import { Bubble, ThoughtChain, XStream } from 'ant-design-x-vue';
import { computed, ref, h } from 'vue';

defineOptions({ name: 'AXXStreamDefaultProtocolSetup' });

const contentChunks = ['He', 'llo', ', w', 'or', 'ld!'];

function mockReadableStream() {
  const sseChunks: string[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    const sseEventPart = `event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n`;
    sseChunks.push(sseEventPart);
  }

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
  // 🌟 Read the stream
  for await (const chunk of XStream({
    readableStream: mockReadableStream(),
  })) {
    console.log(chunk);
    lines.value = [...lines.value, chunk];
  }
}
</script>
<template>
  <Flex :gap="8">
    <div>
      <!-- -------------- Emit -------------- -->
      <Button
        type="primary"
        :style="{ marginBottom: '16px' }"
        @click="readStream"
      >
        Mock Default Protocol - SSE
      </Button>
      <!-- -------------- Content Concat -------------- -->
      <Bubble
        v-if="content"
        :content="content"
      />
    </div>
    <div>
      <ThoughtChain
        :items="
          lines.length
            ? [
              {
                title: 'Mock Default Protocol - Log',
                status: 'success',
                icon: h(TagsOutlined),
                content: h('pre', { style: { overflow: 'scroll' } }, [
                  lines.map((i) => h('code', { key: i.data }, i.data)),
                ]),
              },
            ]
            : []
        "
      />
    </div>
  </Flex>
</template>
<style scoped>
pre {
  width: 'auto';
  margin: 0;

  code {
    display: block;
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
