<script setup lang="ts">
import { CommentOutlined, FireOutlined, HeartOutlined, ReadOutlined, RocketOutlined, SmileOutlined } from '@ant-design/icons-vue';
import { App, Card, ConfigProvider, Space, theme, message } from 'ant-design-vue';
import { Prompts, type PromptsProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXPromptsNestSetup' });

const renderTitle = (icon: any, title: string) => {
  return h(Space, { align: 'start' }, () => [
    icon,
    h('span', null, title)
  ]);
};

const items: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(h(FireOutlined, { style: { color: '#FF4D4F' } }), 'Hot Topics'),
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `What's new in X?`,
      },
      {
        key: '1-2',
        description: `What's AGI?`,
      },
      {
        key: '1-3',
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(h(ReadOutlined, { style: { color: '#1890FF' } }), 'Design Guide'),
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: h(HeartOutlined),
        description: `Know the well`,
      },
      {
        key: '2-2',
        icon: h(SmileOutlined),
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        icon: h(CommentOutlined),
        description: `Express the feeling`,
      },
    ],
  },
  {
    key: '3',
    label: renderTitle(h(RocketOutlined, { style: { color: '#722ED1' } }), 'Start Creating'),
    description: 'How to start a new project?',
    children: [
      {
        key: '3-1',
        label: 'Fast Start',
        description: `Install Ant Design X`,
      },
      {
        key: '3-2',
        label: 'Online Playground',
        description: `Play on the web without installing`,
      },
    ],
  },
];
</script>

<template>
  <ConfigProvider
    :theme="{
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <Card :style="{ borderRadius: 0, border: 0 }">
      <Prompts
        title="Do you want?"
        :items="items"
        wrap
        :styles="{
          item: {
            flex: 'none',
            width: 'calc(30% - 6px)',
            backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
            border: 0,
          },
          subItem: {
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid #FFF',
          },
        }"
        @item-click="(info) => {
          message.success(`You clicked: ${info.data.description}`);
        }"
      />
    </Card>
  </ConfigProvider>
</template>
