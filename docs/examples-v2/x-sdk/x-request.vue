<script setup lang="tsx">
defineOptions({ name: 'AXSdkXRequestV2' });

import { ref } from 'vue';
import { Button, Flex, Typography } from 'ant-design-vue';
import { XRequest } from 'ant-design-x-vue';
import { createMockOpenAIFetch } from '../_shared/mock-chat';

const lines = ref<string[]>([]);

const request = XRequest('https://mock.local/v1/chat/completions', {
  manual: true,
  fetch: createMockOpenAIFetch(() => 'Hello from XRequest.'),
  params: {
    stream: true,
    messages: [{ role: 'user', content: 'hello' }],
  },
  callbacks: {
    onUpdate(chunk) {
      lines.value = [...lines.value, JSON.stringify(chunk)];
    },
    onSuccess() {
      lines.value = [...lines.value, 'success'];
    },
    onError(error) {
      lines.value = [...lines.value, error.message];
    },
  },
});

defineRender(() => (
  <Flex vertical gap={12} align="flex-start">
    <Button type="primary" style={{ alignSelf: 'flex-start', width: 'fit-content' }} onClick={() => { lines.value = []; request.run(); }}>
      Run manual request
    </Button>
    <Typography.Paragraph>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{lines.value.join('\n') || 'Idle. manual is true, so nothing runs until the button.'}</pre>
    </Typography.Paragraph>
  </Flex>
));
</script>
