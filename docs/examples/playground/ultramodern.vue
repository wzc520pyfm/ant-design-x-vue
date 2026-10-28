<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundUltramodern' });

import { Bubble, Conversations, Sender, XProvider } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('640px');

const chat = useMockChat((question) => [
  `**${question}**`,
  '',
  'This playground follows the React 2.0 ultramodern layout: conversation list, bubbles, and a sender.',
  'The model call is a local OpenAI-shaped mock. A live DeepSeek key is not shipped with the docs site.',
].join('\n'));

defineRender(() => (
  <XProvider>
    <Flex style={shell.shellStyle.value}>
      <Flex vertical gap={8} style={shell.sideStyle.value}>
        <Button type="primary" onClick={() => chat.addChat()}>New chat</Button>
        <Conversations
          style={{ flex: 1 }}
          items={chat.conversations.value}
          activeKey={chat.activeConversationKey.value}
          onActiveChange={(key: string) => chat.setActiveConversationKey(key)}
        />
      </Flex>
      <Flex vertical gap={12} style={shell.mainStyle.value}>
        <Bubble.List
          style={{ flex: 1, height: '480px' }}
          items={chat.bubbles.value}
          roles={{
            user: { placement: 'end' },
            ai: {
              placement: 'start',
              contentRender: (content: string) => (
                <XMarkdown className={shell.markdownClass.value} content={content} />
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
