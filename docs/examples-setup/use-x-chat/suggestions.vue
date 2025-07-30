<script setup lang="ts">
import { SmileOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Flex } from 'ant-design-vue';
import { Bubble, Prompts, Sender, useXAgent, useXChat, type BubbleListProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXUseXChatSuggestionsSetup' });

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: BubbleListProps['roles'] = {
  user: {
    placement: 'end',
    avatar: { icon: UserOutlined, style: { background: '#87d068' } },
  },
  text: {
    placement: 'start',
    avatar: { icon: UserOutlined, style: { background: '#fde3cf' } },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: UserOutlined, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (content) => h(Prompts, {
      vertical: true,
      items: (content as any as string[]).map((text) => ({
        key: text,
        icon: h(SmileOutlined, { style: { color: '#FAAD14' } }),
        description: text,
      }))
    }),
  },
};

type AgentUserMessage = {
  type: 'user';
  content: string;
};

type AgentAIMessage = {
  type: 'ai';
  content?: string;
  list?: (
    | {
      type: 'text';
      content: string;
    }
    | {
      type: 'suggestion';
      content: string[];
    }
  )[];
};

type AgentMessage = AgentUserMessage | AgentAIMessage;

const content = ref('');
const senderLoading = ref(false);

// Agent for request
const [ agent ] = useXAgent<AgentMessage, { message: AgentMessage }, Record<string, any>>({
  request: async ({ message }, { onSuccess }) => {
    senderLoading.value = true;
    await sleep();
    const { content } = message || {};
    senderLoading.value = false;
    onSuccess([
      {
        type: 'ai',
        list: [
          {
            type: 'text',
            content: `Do you want?`,
          },
          {
            type: 'suggestion',
            content: [`Look at: ${content}`, `Search: ${content}`, `Try: ${content}`],
          },
        ],
      }
    ]);
  },
});

// Chat messages
const { onRequest, parsedMessages } = useXChat({
  agent: agent.value,

  defaultMessages: [
    {
      id: 'init',
      message: {
        type: 'ai',
        content: 'Hello, what can I do for you?',
      },
      status: 'success',
    },
  ],

  requestPlaceholder: {
    type: 'ai',
    content: 'Waiting...',
  },

  // Convert AgentMessage to BubbleMessage
  parser: (agentMessages) => {
    const list = agentMessages.content ? [agentMessages] : (agentMessages as AgentAIMessage).list;
    return (list || []).map((msg) => ({
      role: msg.type,
      content: msg.content,
    }));
  },
});
</script>
<template>
  <Flex
    vertical
    gap="middle"
  >
    <Bubble.List
      :roles="roles"
      :style="{ maxHeight: 300 }"
      :items="parsedMessages.map(({ id, message, status }) => ({
        key: id,
        loading: status === 'loading',
        ...message,
      }))"
    />
    <Sender
      :loading="senderLoading"
      :value="content"
      :on-change="(v) => content = v"
      :on-submit="(nextContent) => {
        onRequest({
          type: 'user',
          content: nextContent,
        });
        content = '';
      }"
    />
  </Flex>
</template>
