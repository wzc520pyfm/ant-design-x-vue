<script setup lang="ts">
defineOptions({ name: 'AXPlaygroundUltramodernSetup' });

import { h, ref } from 'vue';
import { BulbOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { Actions, Bubble, Conversations, Sender, XProvider } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('640px', '0');
const deepThink = ref(true);
const chat = useMockChat((question) => `**${question}**\n\n本地 ultramodern mock，不会请求 DeepSeek。`);
chat.setConversations([
  { key: '1', label: '什么是 Ant Design X？' },
  { key: '2', label: '如何快速安装和导入组件？' },
  { key: '3', label: '新的 AGI 混合界面' },
]);
const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';

const roles = {
  user: { placement: 'end' as const },
  ai: {
    placement: 'start' as const,
    footer: (content: string) => h(Actions, {
      items: [{ key: 'copy', actionRender: h(Actions.Copy, { text: String(content) }) }],
    }),
    contentRender: (content: string) => h(XMarkdown, { className: shell.markdownClass.value, content }),
  },
};

const createChat = () => {
  if (!chat.bubbles.value.length) {
    message.warning('当前已经是新会话');
    return;
  }
  chat.addChat();
};

const menu = (conversation: { key: string }) => ({
  items: [
    {
      key: 'delete',
      label: '删除',
      icon: h(DeleteOutlined),
      danger: true,
      onClick: () => {
        const next = chat.conversations.value.filter((item) => item.key !== conversation.key);
        chat.setConversations(next);
        if (conversation.key === chat.activeConversationKey.value) {
          chat.setActiveConversationKey(next[0]?.key || '');
        }
      },
    },
  ],
});

const footer = (actionNode: any, _info: unknown) => h('div', { style: 'display:flex;justify-content:space-between;align-items:center;width:100%' }, [
  h(Sender.Switch, {
    value: deepThink.value,
    icon: h(BulbOutlined),
    onChange: (checked: boolean) => { deepThink.value = checked; },
  }, () => '深度思考'),
  actionNode,
]);
</script>

<template>
  <XProvider>
    <a-flex :style="shell.shellStyle.value">
      <a-flex vertical :style="{ ...shell.sideStyle.value, width: '280px', padding: '0 12px' }">
        <div style="display:flex;align-items:center;gap:8px;margin:24px 0;padding:0 12px">
          <img :src="logo" width="24" height="24" alt="logo" />
          <span style="font-weight:700;font-size:16px">Ant Design X</span>
        </div>
        <Conversations
          style="flex:1"
          :creation="{ onClick: createChat }"
          :items="chat.conversations.value.map((item) => ({ ...item, group: '今天' }))"
          :active-key="chat.activeConversationKey.value"
          :on-active-change="chat.setActiveConversationKey"
          groupable
          :menu="menu"
        />
      </a-flex>
      <a-flex vertical justify="space-between" :style="{ ...shell.mainStyle.value, padding: '24px', minHeight: 0 }">
        <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center">
          <div v-if="chat.bubbles.value.length === 0" style="font-size:32px;font-weight:600">Ant Design X 助手</div>
          <Bubble.List v-else style="width:100%;height:100%" :items="chat.bubbles.value" :roles="roles" />
        </div>
        <Sender
          style="max-width:840px;width:100%;margin:0 auto"
          :suffix="false"
          :value="chat.input.value"
          :loading="chat.isRequesting.value"
          placeholder="点击 Enter 发送消息"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :footer="footer"
          @update:value="(value) => chat.input.value = value"
          @submit="chat.send()"
          @cancel="chat.abort()"
        />
      </a-flex>
    </a-flex>
  </XProvider>
</template>
