<script setup lang="ts">
import {
  AlipayCircleOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  GithubOutlined,
  LoadingOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Card, Divider, Flex, Radio, Typography } from 'ant-design-vue';
import {
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Suggestion,
  ThoughtChain,
  XProvider,
} from 'ant-design-x-vue';
import type { XProviderProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXProviderDirectionSetup' });

const value = ref('');
const direction = ref<XProviderProps['direction']>('ltr');

const directionChange = (e: any) => {
  direction.value = e.target.value;
};

const conversationItems = [
  { key: '1', label: 'Conversation - 1', icon: h(GithubOutlined) },
  { key: '2', label: 'Conversation - 2', icon: h(AlipayCircleOutlined) },
];

const bubbleItems = [
  {
    key: '1',
    role: 'user',
    placement: 'end' as const,
    content: 'Hello Ant Design X!',
    avatar: h(UserOutlined),
  },
  { key: '2', role: 'ai', content: 'Hello World!' },
  { key: '3', role: 'ai', content: '', loading: true },
];

const promptItems = [
  { key: '1', icon: h(BulbOutlined, { style: { color: '#FFD700' } }), label: 'Ignite Your Creativity' },
  { key: '2', icon: h(SmileOutlined, { style: { color: '#52C41A' } }), label: 'Tell me a Joke' },
];

const suggestionItems = [{ label: 'Write a report', value: 'report' }];

const thoughtChainItems = [
  {
    title: 'Hello Ant Design X!',
    status: 'success' as const,
    description: 'status: success',
    icon: h(CheckCircleOutlined),
    content: 'Ant Design X help you build AI chat/platform app as ready-to-use 📦.',
  },
  {
    title: 'Hello World!',
    status: 'success' as const,
    description: 'status: success',
    icon: h(CheckCircleOutlined),
  },
  {
    title: 'Pending...',
    status: 'loading' as const,
    description: 'status: pending',
    icon: h(LoadingOutlined),
  },
];

const onSenderChange = (nextVal: string, onTrigger: any) => {
  if (nextVal === '/') {
    onTrigger();
  } else if (!nextVal) {
    onTrigger(false);
  }
  value.value = nextVal;
};
</script>

<template>
  <div>
    <Flex :gap="12" style="margin-bottom: 16px" align="center">
      <Typography.Text>Direction:</Typography.Text>
      <Radio.Group :value="direction" @change="directionChange">
        <Radio.Button value="ltr">LTR</Radio.Button>
        <Radio.Button value="rtl">RTL</Radio.Button>
      </Radio.Group>
    </Flex>

    <Flex :gap="12" vertical>
      <Card>
        <XProvider :direction="direction">
          <Flex style="height: 500px" :gap="12">
            <Conversations
              style="width: 200px"
              default-active-key="1"
              :items="conversationItems"
            />
            <Divider type="vertical" style="height: 100%" />
            <Flex vertical justify="space-between" style="flex: 1">
              <Bubble.List :items="bubbleItems" />
              <Flex vertical :gap="12">
                <Prompts :items="promptItems" />
                <Suggestion :items="suggestionItems">
                  <template #default="{ onTrigger, onKeyDown }">
                    <Sender
                      :value="value"
                      @change="(nextVal: string) => onSenderChange(nextVal, onTrigger)"
                      @keydown="onKeyDown"
                      placeholder='Type "/" to trigger suggestion'
                    />
                  </template>
                </Suggestion>
              </Flex>
            </Flex>
            <Divider type="vertical" style="height: 100%" />
            <ThoughtChain style="width: 200px" :items="thoughtChainItems" />
          </Flex>
        </XProvider>
      </Card>
    </Flex>
  </div>
</template>
