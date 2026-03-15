<script setup lang="ts">
import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { Card, Divider, Flex, message, Space, Typography } from 'ant-design-vue';
import { Conversations, Prompts, Sender, Suggestion, XProvider } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXProviderThemeSetup' });

const colorPrimary = ref('#d10eef');

const promptItems = [
  {
    key: '1',
    label: () =>
      h(Space, { align: 'start' }, () => [
        h(FireOutlined, { style: { color: '#FF4D4F' } }),
        h('span', 'Hot Topics'),
      ]),
    description: 'What are you interested in?',
    children: [
      { key: '1-1', description: "What's new in X?" },
      { key: '1-2', description: "What's AGI?" },
      { key: '1-3', description: 'Where is the doc?' },
    ],
  },
  {
    key: '2',
    label: () =>
      h(Space, { align: 'start' }, () => [
        h(ReadOutlined, { style: { color: '#1890FF' } }),
        h('span', 'Design Guide'),
      ]),
    description: 'How to design a good product?',
    children: [
      { key: '2-1', icon: h(HeartOutlined), description: 'Know the well' },
      { key: '2-2', icon: h(SmileOutlined), description: 'Set the AI role' },
      { key: '2-3', icon: h(CommentOutlined), description: 'Express the feeling' },
    ],
  },
  {
    key: '3',
    label: () =>
      h(Space, { align: 'start' }, () => [
        h(RocketOutlined, { style: { color: '#722ED1' } }),
        h('span', 'Start Creating'),
      ]),
    description: 'How to start a new project?',
    children: [
      { key: '3-1', label: 'Fast Start', description: 'Install Ant Design X' },
      { key: '3-2', label: 'Online Playground', description: 'Play on the web without installing' },
    ],
  },
];

const conversationItems = [
  { key: '1', label: 'Conversation - 1' },
  { key: '2', label: 'Conversation - 2' },
];

const suggestionItems = [{ label: 'Write a report', value: 'report' }];

const onColorChange = (e: Event) => {
  colorPrimary.value = (e.target as HTMLInputElement).value;
};

const onPromptClick = (info: any) => {
  message.success(`You clicked a prompt: ${info.data.key}`);
};
</script>

<template>
  <div>
    <Flex :gap="12" style="margin-bottom: 16px" align="center">
      <Typography.Text>ColorPrimary:</Typography.Text>
      <input type="color" :value="colorPrimary" @input="onColorChange" />
    </Flex>
    <Card>
      <XProvider :theme="{ token: { colorPrimary } }">
        <Flex style="height: 500px" :gap="12">
          <Conversations
            style="width: 130px"
            :creation="{ onClick: () => {} }"
            default-active-key="1"
            :items="conversationItems"
          />
          <Divider type="vertical" style="height: 100%" />
          <Flex justify="space-between" vertical style="flex: 1" :gap="8">
            <Prompts
              title="Do you want?"
              :items="promptItems"
              wrap
              :styles="{
                list: { justifyContent: 'space-around', maxWidth: '1000px', margin: '0 auto' },
                item: {
                  flex: 'none',
                  width: 'calc(30% - 6px)',
                  backgroundImage: 'linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)',
                  border: '0',
                },
                subItem: { background: 'rgba(255,255,255,0.45)', border: '1px solid #FFF' },
              }"
              @item-click="onPromptClick"
            />
            <Suggestion :items="suggestionItems">
              <template #default="{ onTrigger, onKeyDown }">
                <Sender
                  @change="
                    (nextVal: string) => {
                      if (nextVal === '/') {
                        onTrigger();
                      } else if (!nextVal) {
                        onTrigger(false);
                      }
                    }
                  "
                  @keydown="onKeyDown"
                  placeholder='Type "/" to trigger suggestion'
                />
              </template>
            </Suggestion>
          </Flex>
        </Flex>
      </XProvider>
    </Card>
  </div>
</template>
