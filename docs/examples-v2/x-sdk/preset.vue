<script setup lang="tsx">
defineOptions({ name: 'AXSdkPresetV2' });

import { Bubble, Sender } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { useMockChat } from '../_shared/use-mock-chat';

const chat = useMockChat();

defineRender(() => (
  <Flex vertical gap={12} style={{ height: '420px' }}>
    <div style={{ flex: 1, minHeight: 0 }}>
      <Bubble.List
        style={{ height: '280px' }}
        items={chat.bubbles.value}
        roles={{
          user: { placement: 'end' },
          ai: {
            placement: 'start',
            contentRender: (content: string) => <XMarkdown content={content} />,
          },
        }}
      />
    </div>
    <Sender
      value={chat.input.value}
      loading={chat.isRequesting.value}
      placeholder="Ask the local mock"
      onUpdate:value={(value: string) => { chat.input.value = value; }}
      onSubmit={() => chat.send()}
      onCancel={() => chat.abort()}
    />
  </Flex>
));
</script>
