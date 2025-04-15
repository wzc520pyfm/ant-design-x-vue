<script setup lang="ts">
import { AlipayCircleOutlined, BulbOutlined, CheckCircleOutlined, GithubOutlined, LoadingOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Card, Divider, Flex, Radio, Typography } from 'ant-design-vue';
import { Bubble, Conversations, Prompts, Sender, Suggestion, ThoughtChain, XProvider, type XProviderProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXProviderUseSetup' });

const value = ref('');
const direction = ref<XProviderProps['direction']>('ltr');

const directionChange = (e: Event) => {
  direction.value = (e.target as HTMLInputElement).value as XProviderProps['direction']; 
}

const conversationItemList = [
  {
    key: '1',
    label: 'Conversation - 1',
    icon: h(GithubOutlined),
  },
  {
    key: '2',
    label: 'Conversation - 2',
    icon: h(AlipayCircleOutlined),
  },
];

const bubbleItemList = [
  {
    key: '1',
    placement: 'end',
    content: 'Hello Ant Design X!',
    avatar: { icon: h(UserOutlined) },
  },
  {
    key: '2',
    content: 'Hello World!',
  },
  {
    key: '3',
    content: '',
    loading: true,
  },
];

const promptItemList = [
  {
    key: '1',
    icon: h(BulbOutlined, { style: { color: '#FFD700' } }),
    label: 'Ignite Your Creativity',
  },
  {
    key: '2',
    icon: h(SmileOutlined, { style: { color: '#52C41A' } }),
    label: 'Tell me a Joke',
  },
];

const thoughtChainItemList = [
  {
    title: 'Hello Ant Design X!',
    status: 'success',
    description: 'status: success',
    icon: h(CheckCircleOutlined),
    content: 'Ant Design X help you build AI chat/platform app as ready-to-use 📦.',
  },
  {
    title: 'Hello World!',
    status: 'success',
    description: 'status: success',
    icon: h(CheckCircleOutlined),
  },
  {
    title: 'Pending...',
    status: 'pending',
    description: 'status: pending',
    icon: h(LoadingOutlined),
  },
];
</script>
<template>
  <div>
    <Flex
      :gap="12"
      :style="{ marginBottom: '16px' }" 
      align="center"
    >
      <Typography.Text>Direction:</Typography.Text>
      <Radio.Group
        :value="direction"
        @change="directionChange"
      >
        <Radio.Button value="ltr">
          LTR
        </Radio.Button>
        <Radio.Button value="rtl">
          RTL
        </Radio.Button>
      </Radio.Group>
    </Flex>
    <Card>
      <XProvider :direction="direction">
        <Flex
          :style="{ height: '500px' }"
          gap="12"
        >
          <Conversations
            :style="{ width: '200px' }"
            default-active-key="1"
            :items="conversationItemList"
          />
          <Divider
            type="vertical"
            :style="{ height: '100%' }"
          />
          <Flex
            vertical
            :style="{ flex: 1 }"
            :gap="8"
          >
            <Bubble.List
              :style="{ flex: 1 }"
              :items="bubbleItemList"
            />
            <Prompts
              :items="promptItemList"
            />
            <Suggestion
              :items="[{ label: 'Write a report', value: 'report' }]"
            >
              <template #default="{ onTrigger, onKeyDown }">
                <Sender
                  :value="value"
                  :on-change="(nextVal) => {
                    if (nextVal === '/') {
                      onTrigger();
                    } else if (!nextVal) {
                      onTrigger(false);
                    }
                    value = nextVal;
                  }"
                  :on-key-down="onKeyDown"
                  placeholder="Type &quot;/&quot; to trigger suggestion"
                />
              </template>
            </Suggestion>
          </Flex>
          <Divider
            type="vertical"
            :style="{ height: '100%' }"
          />
          <ThoughtChain
            :style="{ width: '200px' }"
            :items="thoughtChainItemList"
          />
        </Flex>
      </XProvider>
    </Card>
  </div>
</template>
