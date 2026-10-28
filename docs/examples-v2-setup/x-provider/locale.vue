<script setup lang="ts">
import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';
import { Card, Flex, Radio, RadioButton, Typography } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { Actions, Conversations, XProvider, en_US, zh_CN } from 'ant-design-x-vue';
import { computed, h, ref } from 'vue';

defineOptions({ name: 'AXProviderLocaleSetup' });

const labels = {
  en: {
    write: 'Help Me Write',
    coding: 'AI Coding',
    createImage: 'Create Image',
    deepSearch: 'Deep Search',
  },
  zh: {
    write: '帮我写作',
    coding: 'AI编码',
    createImage: '图片生成',
    deepSearch: '深度搜索',
  },
};

const localeType = ref<'zh' | 'en'>('zh');
const locale = computed(() =>
  localeType.value === 'zh' ? { ...zhCN, ...zh_CN } : { ...enUS, ...en_US },
);
const conversationItems = computed(() => [
  { key: 'write', label: labels[localeType.value].write, icon: h(EditOutlined) },
  { key: 'coding', label: labels[localeType.value].coding, icon: h(CodeOutlined) },
  { key: 'createImage', label: labels[localeType.value].createImage, icon: h(FileImageOutlined) },
  { key: 'deepSearch', label: labels[localeType.value].deepSearch, icon: h(FileSearchOutlined) },
]);
const actionItems = [
  { key: 'feedback', actionRender: () => h(Actions.Feedback) },
  { key: 'copy', label: 'copy', actionRender: () => h(Actions.Copy, { text: 'copy value' }) },
  { key: 'audio', label: 'audio', actionRender: () => h(Actions.Audio) },
];
</script>

<template>
  <div>
    <Flex gap="12" style="margin-bottom: 16px" align="center">
      <Typography.Text>Change locale of components:</Typography.Text>
      <Radio.Group v-model:value="localeType">
        <RadioButton value="en">English</RadioButton>
        <RadioButton value="zh">中文</RadioButton>
      </Radio.Group>
    </Flex>
    <XProvider :locale="locale">
      <Flex gap="12" vertical>
        <Card>
          <Conversations
            :style="{ width: '200px' }"
            default-active-key="write"
            :creation="{ onClick: () => {} }"
            :items="conversationItems"
          />
        </Card>
        <Card>
          <Actions :items="actionItems" />
        </Card>
      </Flex>
    </XProvider>
  </div>
</template>
