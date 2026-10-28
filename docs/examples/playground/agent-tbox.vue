<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundAgentTbox' });

import { computed } from 'vue';
import {
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
  XProvider,
} from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';

const chat = useMockChat((question) => [
  `About **${question}**:`,
  '',
  'This page mirrors the React 2.0 Tbox playground with Welcome, prompts, a thought chain, and chat.',
  'The official `tbox-nodejs-sdk` is a Node client. The docs site cannot open a live Tbox session, so the provider is a local mock.',
].join('\n'));

const prompts = [
  { key: 'what', label: 'What is Tbox?', description: 'Local explanation' },
  { key: 'design', label: 'Design guide', description: 'RICH, in one reply' },
];

const chain = computed(() => [
  { key: 'understand', title: 'Read the question', status: 'success' as const },
  {
    key: 'answer',
    title: chat.isRequesting.value ? 'Drafting' : 'Draft ready',
    status: (chat.isRequesting.value ? 'loading' : 'success') as 'loading' | 'success',
  },
]);

defineRender(() => (
  <XProvider>
    <Flex style={{ height: '720px', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Flex vertical gap={8} style={{ width: '240px', padding: '12px', background: '#fafafa' }}>
        <Button type="primary" onClick={() => chat.addChat()}>New chat</Button>
        <Conversations
          items={chat.conversations.value}
          activeKey={chat.activeConversationKey.value}
          onActiveChange={(key: string) => chat.setActiveConversationKey(key)}
        />
      </Flex>
      <Flex vertical gap={12} style={{ flex: 1, padding: '16px', minWidth: 0, overflow: 'auto' }}>
        {chat.bubbles.value.length === 0 && (
          <>
            <Welcome
              title="Ant Design X and Tbox"
              description="Vue layout of the React 2.0 agent playground. Requests stay on this page."
            />
            <Prompts
              items={prompts}
              onItemClick={(info: { data: { label?: string } }) => chat.send(String(info.data.label || ''))}
            />
          </>
        )}
        <Think title={chat.isRequesting.value ? 'Thinking' : 'Thought'} loading={chat.isRequesting.value}>
          The live Tbox client is not bundled. This block shows where the reasoning panel sits.
        </Think>
        <ThoughtChain items={chain.value} />
        <Bubble.List
          style={{ minHeight: '220px' }}
          items={chat.bubbles.value}
          roles={{
            user: { placement: 'end' },
            ai: {
              placement: 'start',
              contentRender: (content: string) => <XMarkdown content={content} />,
            },
          }}
        />
        <Sender
          value={chat.input.value}
          loading={chat.isRequesting.value}
          placeholder="Ask the local agent"
          onUpdate:value={(value: string) => { chat.input.value = value; }}
          onSubmit={() => chat.send()}
          onCancel={() => chat.abort()}
        />
      </Flex>
    </Flex>
  </XProvider>
));
</script>
