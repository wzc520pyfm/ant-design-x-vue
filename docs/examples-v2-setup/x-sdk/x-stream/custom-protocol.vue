<script setup lang="ts">
defineOptions({ name: 'AXSdkXStreamCustomProtocolV2Setup' });

import { computed, h, ref } from 'vue';
import { TagsOutlined } from '@ant-design/icons-vue';
import { ThoughtChain, XStream } from 'ant-design-x-vue';

const sipHeaders = [
  'INVITE sip:[email protected] SIP/2.0\n',
  'Via: SIP/2.0/UDP [host];branch=123456\n',
  'Content-Type: application/sdp\n\n',
];

const sdp = [
  'v=0\n',
  'o=alice 2890844526 2890844526 IN IP4 [host]\n',
  's=\n',
  'c=IN IP4 [host]\n',
  't=0 0\n',
  'm=audio 49170 RTP/AVP 0\n',
  'a=rtpmap:0 PCMU/8000\n',
  'm=video 51372 RTP/AVP 31\n',
  'a=rtpmap:31 H261/90000\n',
  'm=video 53000 RTP/AVP 32\n',
  'a=rtpmap:32 MPV/90000\n\n',
];

function mockReadableStream() {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of sipHeaders.concat(sdp)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

const lines = ref<string[]>([]);
const chainItems = computed(() =>
  lines.value.length
    ? [
        {
          key: 'log',
          title: 'Mock Custom Protocol - Log',
          status: 'success' as const,
          icon: h(TagsOutlined),
          content: h('pre', { style: { overflow: 'auto', margin: 0 } }, [
            h('code', lines.value.join('')),
          ]),
        },
      ]
    : [],
);

async function readStream() {
  lines.value = [];
  for await (const chunk of XStream({
    readableStream: mockReadableStream(),
    transformStream: new TransformStream<string, string>({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    }),
  })) {
    lines.value = [...lines.value, chunk as string];
  }
}
</script>

<template>
  <a-flex vertical :gap="16">
    <a-button type="primary" style="align-self: flex-start; width: fit-content" @click="readStream">
      Mock Custom Protocol - SIP
    </a-button>
    <ThoughtChain :items="chainItems" />
  </a-flex>
</template>
