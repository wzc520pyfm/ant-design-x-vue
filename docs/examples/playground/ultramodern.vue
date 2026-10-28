<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundUltramodern' });

import { Bubble, Conversations, Sender, XProvider } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';

const chat = useMockChat((question) => [
  `**${question}**`,
  '',
  'This playground follows the React 2.0 ultramodern layout: conversation list, bubbles, and a sender.',
  'The model call is a local OpenAI-shaped mock. A live DeepSeek key is not shipped with the docs site.',
].join('\n'));

defineRender(() => (
  <XProvider>
    <Flex style={{ height: '640px', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Flex vertical gap={8} style={{ width: '240px', padding: '12px', background: '#fafafa' }}>
        <Button type="primary" onClick={() => chat.addChat()}>New chat</Button>
        <Conversations
          style={{ flex: 1 }}
          items={chat.conversations.value}
          activeKey={chat.activeConversationKey.value}
          onActiveChange={(key: string) => chat.setActiveConversationKey(key)}
        />
      </Flex>
      <Flex vertical gap={12} style={{ flex: 1, padding: '12px', minWidth: 0 }}>
        <Bubble.List
          style={{ flex: 1, height: '480px' }}
          items={chat.bubbles.value}
          roles={{
            user: { placement: 'end' },
            ai: {
              placement: 'start',
              contentRender: (content: string) => (
                <XMarkdown className="x-markdown-light" content={content} />
              ),
            },
          }}
        />
        <Sender
          value={chat.input.value}
          loading={chat.isRequesting.value}
          placeholder="Message"
          onUpdate:value={(value: string) => { chat.input.value = value; }}
          onSubmit={() => chat.send()}
          onCancel={() => chat.abort()}
        />
      </Flex>
    </Flex>
  </XProvider>
));
</script>
