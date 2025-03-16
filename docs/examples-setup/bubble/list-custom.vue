<script setup lang="ts">
import {
  CoffeeOutlined,
  FireOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Attachments, BubbleList, Prompts } from 'ant-design-x-vue';
import { Flex, Typography } from 'ant-design-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXBubbleListCustomSetup' });

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: true,
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items) =>
      h(Prompts, { vertical: true, items: items as any }),
  },
  file: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items: any) =>
      h(
        Flex,
        { vertical: true, gap: 'middle' },
        items.map((item: any) =>
          h(Attachments.FileCard, { key: item.uid, item: item }),
        ),
      ),
  },
};
</script>

<template>
  <BubbleList
    :roles="roles"
    :items="[
      // Normal
      {
        key: 0,
        role: 'ai',
        content: 'Normal message',
      },

      // ReactNode
      {
        key: 1,
        role: 'ai',
        content: h(Typography.Text, { type: 'danger' }, 'ReactNode message'),
      },

      // Role: suggestion
      {
        key: 2,
        role: 'suggestion',
        content: [
          {
            key: '6',
            icon: h(CoffeeOutlined, { style: { color: '#964B00' } }),
            description: 'How to rest effectively after long hours of work?',
          },
          {
            key: '7',
            icon: h(SmileOutlined, { style: { color: '#FAAD14' } }),
            description:
              'What are the secrets to maintaining a positive mindset?',
          },
          {
            key: '8',
            icon: h(FireOutlined, { style: { color: '#FF4D4F' } }),
            description: 'How to stay calm under immense pressure?',
          },
        ],
      },
      // Role: file
      {
        key: 3,
        role: 'file',
        content: [
          {
            uid: '1',
            name: 'excel-file.xlsx',
            size: 111111,
            description: 'Checking the data',
          },
          {
            uid: '2',
            name: 'word-file.docx',
            size: 222222,
            status: 'uploading',
            percent: 23,
          },
        ],
      },
    ]"
  />
</template>
