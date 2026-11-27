<script setup lang="ts">
defineOptions({ name: 'AXPlaygroundUltramodernSetup' });

import { h, computed, onMounted, ref, watch } from 'vue';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons-vue';
import type { BubbleListProps, SenderProps } from 'ant-design-x-vue';
import {
  Actions,
  Bubble,
  Conversations,
  Sender,
  XProvider,
  useXChat,
  useXConversations,
  type DefaultMessageInfo,
  type XModelMessage,
} from 'ant-design-x-vue';
import { Flex, message } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import dayjs from 'dayjs';
import { OpenAIOutlined } from '../../examples-v2/_shared/openai-outlined';
import { createLiveGlmProvider } from '../../examples-v2/_shared/playground-glm-provider';
import { playgroundZh as locale } from '../../examples-v2/_shared/playground-locale';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('640px', '0');
const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';

const DEFAULT_CONVERSATIONS_ITEMS = [
  { key: 'default-0', label: locale.whatIsAntDesignX, group: locale.today },
  { key: 'default-1', label: locale.howToQuicklyInstallAndImportComponents, group: locale.today },
  { key: 'default-2', label: locale.newAgiHybridInterface, group: locale.yesterday },
];

const HISTORY_MESSAGES: Record<string, DefaultMessageInfo<XModelMessage>[]> = {
  'default-1': [
    {
      message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    { message: { role: 'assistant', content: locale.aiMessage_2 }, status: 'success' },
  ],
  'default-2': [
    { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
    { message: { role: 'assistant', content: locale.aiMessage_1 }, status: 'success' },
  ],
};

const slotConfig: SenderProps['slotConfig'] = [
  { type: 'text', value: locale.slotTextStart },
  {
    type: 'select',
    key: 'destination',
    props: {
      defaultValue: 'X SDK',
      options: ['X SDK', 'X Markdown', 'Bubble'],
    },
  },
  { type: 'text', value: locale.slotTextEnd },
];

const historyMessageFactory = (conversationKey: string) =>
  HISTORY_MESSAGES[conversationKey] || [];

const { conversations, addConversation, setConversations } = useXConversations({
  defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
});

const curConversation = ref(DEFAULT_CONVERSATIONS_ITEMS[0].key);
const activeConversation = ref<string>();
const deepThink = ref(true);
const senderRef = ref<InstanceType<typeof Sender> | null>(null);
const onReloadRef = ref<ReturnType<typeof useXChat>['onReload']>();

const provider = createLiveGlmProvider(() => curConversation.value);

const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
  provider,
  conversationKey: curConversation,
  defaultMessages: ({ conversationKey }) =>
    historyMessageFactory(String(conversationKey ?? '')),
  requestPlaceholder: () => ({ content: locale.noData, role: 'assistant' }),
  requestFallback: (_: unknown, { error, errorInfo, messageInfo }: any) => {
    if (error?.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || locale.requestAborted,
        role: 'assistant',
      };
    }
    return {
      content: errorInfo?.error?.message || locale.requestFailed,
      role: 'assistant',
    };
  },
});

watch(
  () => onReload,
  (fn) => {
    onReloadRef.value = fn;
  },
  { immediate: true },
);

onMounted(() => {
  senderRef.value?.focus?.({ cursor: 'end' });
});

const conversationItems = computed(() =>
  conversations.value
    .map(({ key, label, ...other }) => ({
      key,
      label:
        key === activeConversation.value
          ? `[${locale.curConversation}]${label}`
          : label,
      ...other,
    }))
    .sort((a) => (a.key === activeConversation.value ? -1 : 0)),
);

const bubbleItems = computed(() =>
  messages.value.map((i) => ({
    ...i.message,
    key: i.id,
    status: i.status,
    loading: i.status === 'loading',
    extraInfo: (i.message as any).extraInfo,
  })),
);

const role = computed((): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    footer: (content: string, { status, key }: any) => {
      if (status === 'updating' || status === 'loading') return null as any;
      const text = typeof content === 'string' ? content : '';
      return key
        ? h('div', { style: 'display:flex' }, [
            h(Actions, {
              items: [
                {
                  key: 'retry',
                  label: locale.retry,
                  icon: h(SyncOutlined),
                  onItemClick: () => {
                    onReloadRef.value?.(key as string, { userAction: 'retry' } as never);
                  },
                },
                {
                  key: 'copy',
                  actionRender: h(Actions.Copy, { text }),
                },
              ],
            }),
          ])
        : null;
    },
    contentRender: (content: any, { status }: { status?: string }) => {
      const text = typeof content === 'string' ? content : '';
      return h(XMarkdown, {
        paragraphTag: 'div',
        content: text.replace(/\n\n/g, '<br/><br/>'),
        className: shell.markdownClass.value,
        streaming: {
          hasNextChunk: status === 'updating',
          enableAnimation: true,
        },
      });
    },
  },
  user: { placement: 'end' },
}));

const sideStyle = computed(() => ({
  ...shell.sideStyle.value,
  width: '280px',
  padding: '0 12px',
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100%',
}));

const chatStyle = computed(() => ({
  ...shell.mainStyle.value,
  padding: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  minWidth: 0,
  overflow: 'auto',
}));

const senderWrapStyle = computed(() => ({
  padding: '8px',
  ...(messages.value.length === 0
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        height: '100%',
      }
    : {}),
}));

const createChat = () => {
  if (!messages.value.length) {
    message.error(locale.itIsNowANewConversation);
    return;
  }
  const now = dayjs().valueOf().toString();
  addConversation({
    key: now,
    label: `${locale.newConversation} ${conversations.value.length + 1}`,
    group: locale.today,
  });
  curConversation.value = now;
};

const menu = (conversation: { key: string }) => ({
  items: [
    {
      label: locale.delete,
      key: 'delete',
      icon: h(DeleteOutlined),
      danger: true,
      onClick: () => {
        const next = conversations.value.filter((item) => item.key !== conversation.key);
        setConversations(next);
        if (conversation.key === curConversation.value) {
          curConversation.value = next[0]?.key || '';
        }
      },
    },
  ],
});

const footer = (actionNode: any) =>
  h(Flex, { justify: 'space-between', align: 'center' }, () => [
    h(Flex, { gap: 'small', align: 'center' }, () => [
      h(
        Sender.Switch,
        {
          value: deepThink.value,
          icon: h(OpenAIOutlined),
          onChange: (checked: boolean) => {
            deepThink.value = checked;
          },
        },
        () => locale.deepThink,
      ),
    ]),
    h(Flex, { align: 'center' }, () => [actionNode]),
  ]);

const onSubmit = (val: string) => {
  if (!val) return;
  onRequest({
    messages: [{ role: 'user', content: val }],
    thinking: { type: 'disabled' },
  } as never);
  activeConversation.value = curConversation.value;
  senderRef.value?.clear?.();
};

const onActiveChange = (key: string) => {
  curConversation.value = key;
};
</script>

<template>
  <XProvider>
    <a-flex :style="shell.shellStyle.value">
      <div :style="sideStyle">
        <div style="display:flex;align-items:center;gap:8px;margin:24px 0;padding:0 12px">
          <img :src="logo" width="24" height="24" alt="logo" draggable="false">
          <span style="font-weight:700;font-size:16px">Ant Design X</span>
        </div>
        <Conversations
          style="flex:1;overflow-y:auto;margin-top:12px"
          :creation="{ onClick: createChat }"
          :items="conversationItems"
          :active-key="curConversation"
          :on-active-change="onActiveChange"
          groupable
          :styles="{ item: { padding: '0 8px' } }"
          :menu="menu"
        />
      </div>

      <div class="ax-playground-ultramodern-chat" :style="chatStyle">
        <div style="flex:1;overflow-y:auto;margin-block-start:16px">
          <Bubble.List
            v-if="messages.length !== 0"
            :styles="{ root: { maxWidth: 940, marginBlockEnd: 24 } }"
            :items="bubbleItems"
            :role="role"
          />
        </div>
        <div :style="senderWrapStyle">
          <div
            v-if="messages.length === 0"
            style="margin-block-start:25%;font-size:32px;margin-block-end:38px;font-weight:600"
          >
            {{ locale.agentName }}
          </div>
          <Sender
            :key="curConversation"
            ref="senderRef"
            style="max-width:840px;width:100%"
            :suffix="false"
            :slot-config="slotConfig"
            :loading="isRequesting"
            :placeholder="locale.placeholder"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            :footer="footer"
            @submit="onSubmit"
            @cancel="abort()"
          />
        </div>
      </div>
    </a-flex>
  </XProvider>
</template>

<style>
.ax-playground-ultramodern-chat .ant-bubble-content-updating {
  background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: bottom;
}
</style>
