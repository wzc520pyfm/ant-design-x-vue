<script setup lang="ts">
defineOptions({ name: 'AXPlaygroundAgentTboxSetup' });

import { computed, h } from 'vue';
import { AppstoreOutlined, FileSearchOutlined, ScheduleOutlined } from '@ant-design/icons-vue';
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
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('720px', '16px');
const chat = useMockChat((question) => `关于 **${question}**。\n\n本地百宝箱布局 mock，tbox-nodejs-sdk 不能在浏览器里运行。`);
chat.setConversations([
  { key: '1', label: '什么是百宝箱 Tbox.cn?' },
  { key: '2', label: '百宝箱可以做什么?' },
]);

const hotTopics = [{
  key: '1',
  label: '最热话题',
  children: [
    { key: '1-1', description: '什么是百宝箱 Tbox.cn?' },
    { key: '1-2', description: '百宝箱可以做什么?' },
  ],
}];
const designGuide = [{
  key: '2',
  label: '设计指南',
  children: [
    { key: '2-1', label: '意图', description: 'AI 理解用户需求并提供解决方案' },
    { key: '2-2', label: '角色', description: 'AI 的公众形象' },
  ],
}];
const senderPrompts = [
  { key: '1', description: '动态', icon: h(ScheduleOutlined) },
  { key: '2', description: '组件', icon: h(AppstoreOutlined) },
  { key: '3', description: '指南', icon: h(FileSearchOutlined) },
];
const chain = computed(() => [
  {
    key: 'running',
    title: chat.isRequesting.value ? '正在调用模型' : '大模型执行完成',
    status: (chat.isRequesting.value ? 'loading' : 'success') as 'loading' | 'success',
  },
]);
const roles = {
  user: { placement: 'end' as const },
  ai: {
    placement: 'start' as const,
    contentRender: (content: string) => h(XMarkdown, { className: shell.markdownClass.value, content }),
  },
};
const cardStyle = {
  flex: '1 1 0',
  minWidth: 0,
  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
  borderRadius: '12px',
  border: 'none',
};

function ask(info: { data: { description?: string } }) {
  chat.send(String(info.data.description || ''));
}
</script>

<template>
  <XProvider>
    <a-flex :style="shell.shellStyle.value">
      <a-flex vertical :style="{ ...shell.sideStyle.value, width: '280px', padding: '0 12px' }">
        <div style="margin:24px 0;padding:0 12px;font-weight:700">Ant Design X</div>
        <Conversations
          style="flex:1"
          :creation="{ onClick: () => chat.addChat() }"
          :items="chat.conversations.value.map((item) => ({ ...item, group: '今天' }))"
          :active-key="chat.activeConversationKey.value"
          :on-active-change="chat.setActiveConversationKey"
          groupable
        />
      </a-flex>
      <a-flex vertical :gap="12" :style="{ ...shell.mainStyle.value, overflow: 'auto' }">
        <template v-if="chat.bubbles.value.length === 0">
          <Welcome
            variant="borderless"
            title="你好， 我是 Ant Design X & 百宝箱智能体"
            description="基于 Ant Design 的 AGI 产品界面解决方案。百宝箱 Node SDK 未打进文档页。"
          />
          <a-flex :gap="16">
            <Prompts class="ax-tbox-prompts" :items="hotTopics" :styles="{ item: cardStyle }" :on-item-click="ask" />
            <Prompts class="ax-tbox-prompts" :items="designGuide" :styles="{ item: cardStyle }" :on-item-click="ask" />
          </a-flex>
        </template>
        <template v-else>
          <Think :title="chat.isRequesting.value ? '深度思考中' : '深度思考完成'" :loading="chat.isRequesting.value">
            真实百宝箱流式推理不在浏览器里。
          </Think>
          <ThoughtChain :items="chain" />
          <Bubble.List style="min-height: 220px" :items="chat.bubbles.value" :roles="roles" />
        </template>
        <Prompts :items="senderPrompts" :styles="{ item: { padding: '6px 12px' } }" :on-item-click="ask" />
        <Sender
          :value="chat.input.value"
          :loading="chat.isRequesting.value"
          placeholder="向我提问吧"
          @update:value="(value) => chat.input.value = value"
          :on-submit="() => chat.send()"
          :on-cancel="() => chat.abort()"
        />
      </a-flex>
    </a-flex>
  </XProvider>
</template>

<style>
.ax-tbox-prompts .ant-prompts-label {
  color: rgba(0, 0, 0, 0.88) !important;
}
.ax-tbox-prompts .ant-prompts-desc,
.ax-tbox-prompts .ant-prompts-icon {
  color: rgba(0, 0, 0, 0.65) !important;
}
</style>
