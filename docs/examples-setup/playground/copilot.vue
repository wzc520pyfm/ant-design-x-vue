<script setup lang="ts">
defineOptions({ name: 'PlaygroundCopilotSetup' });

import {
  AppstoreAddOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ProductOutlined,
  ReloadOutlined,
  ScheduleOutlined,
} from '@ant-design/icons-vue';
import type { AttachmentsProps, BubbleListProps, ConversationItemType } from 'ant-design-x-vue';
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Suggestion,
  Think,
  Welcome,
  useXChat,
  useXConversations,
  type DefaultMessageInfo,
  type XModelMessage,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { Button, Flex, Image, Popover, Space, message, theme } from 'ant-design-vue';
import dayjs from 'dayjs';
import { computed, defineComponent, h, ref } from 'vue';
import { OpenAIOutlined } from '../../examples-v2/_shared/openai-outlined';
import { createGlmProviderFactory } from '../../examples-v2/_shared/playground-glm-provider';
import { playgroundZh as locale } from '../../examples-v2/_shared/playground-locale';

const { token } = theme.useToken();

const DEFAULT_CONVERSATIONS_ITEMS: ConversationItemType[] = [
  { key: '5', label: locale.newSession, group: locale.today },
  { key: '4', label: locale.whatHasAntDesignXUpgraded, group: locale.today },
  { key: '3', label: locale.newAgiHybridInterface, group: locale.today },
  { key: '2', label: locale.howToQuicklyInstallAndImportComponents, group: locale.yesterday },
  { key: '1', label: locale.whatIsAntDesignX, group: locale.yesterday },
];

const HISTORY_MESSAGES: Record<string, DefaultMessageInfo<XModelMessage>[]> = {
  '5': [
    { message: { role: 'user', content: locale.historyMessages.newSession.user }, status: 'success' },
    {
      message: { role: 'assistant', content: locale.historyMessages.newSession.assistant },
      status: 'success',
    },
  ],
  '4': [
    {
      message: { role: 'user', content: locale.historyMessages.whatHasAntDesignXUpgraded.user },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: locale.historyMessages.whatHasAntDesignXUpgraded.assistant,
      },
      status: 'success',
    },
  ],
  '3': [
    {
      message: { role: 'user', content: locale.historyMessages.newAgiHybridInterface.user },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: locale.historyMessages.newAgiHybridInterface.assistant,
      },
      status: 'success',
    },
  ],
  '2': [
    {
      message: {
        role: 'user',
        content: locale.historyMessages.howToQuicklyInstallAndImportComponents.user,
      },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: locale.historyMessages.howToQuicklyInstallAndImportComponents.assistant,
      },
      status: 'success',
    },
  ],
  '1': [
    {
      message: { role: 'user', content: locale.historyMessages.whatIsAntDesignX.user },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: locale.historyMessages.whatIsAntDesignX.assistant,
      },
      status: 'success',
    },
  ],
};

const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<XModelMessage>[] =>
  HISTORY_MESSAGES[conversationKey] || [];

const MOCK_SUGGESTIONS = [
  { label: locale.writeAReport, value: 'report' },
  { label: locale.drawAPicture, value: 'draw' },
  {
    label: locale.checkSomeKnowledge,
    value: 'knowledge',
    icon: h(OpenAIOutlined),
    children: [
      { label: locale.aboutReact, value: 'react' },
      { label: locale.aboutAntDesign, value: 'antd' },
    ],
  },
];

const MOCK_QUESTIONS = [
  locale.whatHasAntDesignXUpgraded,
  locale.whatComponentsAreInAntDesignX,
  locale.howToQuicklyInstallAndImportComponents,
];

const provider = createGlmProviderFactory({ thinkingDisabled: true })('copilot');

const ThinkComponent = defineComponent({
  name: 'PlaygroundCopilotThinkSetup',
  props: {
    streamStatus: { type: String, default: 'done' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        Think,
        {
          title: props.streamStatus === 'done' ? locale.completeThinking : `${locale.deepThinking}...`,
          loading: props.streamStatus !== 'done',
        },
        () => slots.default?.(),
      );
  },
});

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    footer: () =>
      h('div', { style: { display: 'flex' } }, [
        h(Button, { type: 'text', size: 'small', icon: h(ReloadOutlined) }),
        h(Button, { type: 'text', size: 'small', icon: h(CopyOutlined) }),
        h(Button, { type: 'text', size: 'small', icon: h(LikeOutlined) }),
        h(Button, { type: 'text', size: 'small', icon: h(DislikeOutlined) }),
      ]),
    contentRender(content: string) {
      const newContent = String(content ?? '').replace(/\n\n/g, '<br/><br/>');
      return h(XMarkdown, {
        content: newContent,
        components: { think: ThinkComponent },
      });
    },
  },
  user: { placement: 'end' },
};

const styles = computed(() => ({
  copilotChat: {
    display: 'flex',
    flexDirection: 'column' as const,
    background: token.value.colorBgContainer,
    color: token.value.colorText,
    overflow: 'hidden',
  },
  chatHeader: {
    height: '52px',
    boxSizing: 'border-box' as const,
    borderBottom: `1px solid ${token.value.colorBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px 0 16px',
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: '15px',
  },
  headerButton: {
    fontSize: '18px',
  },
  conversations: {
    width: '300px',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto' as const,
    paddingInline: '16px',
    marginBlockStart: `${token.value.margin}px`,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 0,
  },
  chatWelcome: {
    marginInline: `${token.value.margin}px`,
    padding: '12px 16px',
    borderRadius: '12px',
    background: token.value.colorBgTextHover,
    marginBottom: `${token.value.margin}px`,
  },
  chatSend: {
    padding: `${token.value.padding}px`,
  },
}));

const workareaStyles = computed(() => ({
  copilotWrapper: {
    width: '100%',
    height: 'min(100vh, 720px)',
    display: 'flex',
    border: `1px solid ${token.value.colorBorderSecondary}`,
    borderRadius: `${token.value.borderRadiusLG}px`,
    overflow: 'hidden',
  },
  workarea: {
    flex: 1,
    background: token.value.colorBgLayout,
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
  },
  workareaHeader: {
    boxSizing: 'border-box' as const,
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px 0 28px',
    borderBottom: `1px solid ${token.value.colorBorder}`,
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: '15px',
    color: token.value.colorText,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerButton: {
    backgroundImage: 'linear-gradient(78deg, #8054f2 7%, #3895da 95%)',
    borderRadius: '12px',
    height: '24px',
    width: '93px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.3s',
  },
  workareaBody: {
    flex: 1,
    padding: `${token.value.padding}px`,
    background: token.value.colorBgContainer,
    borderRadius: `${token.value.borderRadius}px`,
    minHeight: 0,
  },
  bodyContent: {
    overflow: 'auto',
    height: '100%',
    paddingRight: '10px',
  },
  bodyText: {
    color: token.value.colorText,
    padding: '8px',
  },
}));

const attachmentsRef = ref<{ upload?: (file: File | File[] | FileList) => void } | null>(null);
const listRef = ref<{ scrollTo?: (opts: { top: string }) => void } | null>(null);
const attachmentsOpen = ref(false);
const files = ref<NonNullable<AttachmentsProps['items']>>([]);
const inputValue = ref('');
const copilotOpen = ref(true);

const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
  getConversation,
  setConversation,
} = useXConversations({
  defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
});

const { onRequest, messages, isRequesting, abort } = useXChat({
  provider,
  conversationKey: activeConversationKey,
  defaultMessages: ({ conversationKey }) => historyMessageFactory(String(conversationKey ?? '')),
  requestPlaceholder: () => ({
    content: locale.noData,
    role: 'assistant',
  }),
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

const conversationItems = computed(() =>
  conversations.value?.map((i) =>
    i.key === activeConversationKey.value
      ? { ...i, label: `[${locale.curConversation}] ${i.label}` }
      : i,
  ),
);

const bubbleItems = computed(() =>
  messages.value?.map((i) => ({
    ...i.message,
    key: i.id,
    status: i.status,
    loading: i.status === 'loading',
  })),
);

const promptItems = MOCK_QUESTIONS.map((i) => ({ key: i, description: i }));

function handleUserSubmit(val: string) {
  if (!val) return;
  onRequest({
    messages: [{ role: 'user', content: val }],
  });
  listRef.value?.scrollTo?.({ top: 'bottom' });

  const conversation = getConversation(activeConversationKey.value);
  if (conversation?.label === locale.newSession) {
    setConversation(activeConversationKey.value, {
      ...conversation,
      label: val.slice(0, 20),
    });
  }
}

function onPasteFile(fileList: FileList) {
  for (const file of Array.from(fileList)) {
    attachmentsRef.value?.upload?.(file);
  }
  attachmentsOpen.value = true;
}

function createNewSession() {
  if (messages.value?.length) {
    const timeNow = dayjs().valueOf().toString();
    addConversation({
      key: timeNow,
      label: locale.newSession,
      group: locale.today,
    });
    setActiveConversationKey(timeNow);
  } else {
    message.error(locale.itIsNowANewConversation);
  }
}

function setCopilotOpen(val: boolean) {
  copilotOpen.value = val;
}

function onAttachmentsChange(info: { fileList: NonNullable<AttachmentsProps['items']> }) {
  files.value = info.fileList;
}

function attachmentsPlaceholder(type: string) {
  return type === 'drop'
    ? { title: locale.dropFileHere }
    : {
        icon: h(CloudUploadOutlined),
        title: locale.uploadFiles,
        description: locale.clickOrDragFilesToUpload,
      };
}

function onPromptItemClick(info: { data?: { description?: string } }) {
  handleUserSubmit(String(info?.data?.description ?? ''));
}

function onSuggestionSelect(itemVal: string) {
  inputValue.value = `[${itemVal}]:`;
}

function onSenderChange(onTrigger: (v?: boolean) => void, v: string) {
  onTrigger(v === '/');
  inputValue.value = v;
}

function onSenderSubmit() {
  handleUserSubmit(inputValue.value);
  inputValue.value = '';
}
</script>

<template>
  <div :style="workareaStyles.copilotWrapper">
    <div :style="workareaStyles.workarea">
      <div :style="workareaStyles.workareaHeader">
        <div :style="workareaStyles.headerTitle">
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            :draggable="false"
            alt="logo"
            :width="20"
            :height="20"
          >
          Ant Design X
        </div>
        <div
          v-if="!copilotOpen"
          :style="workareaStyles.headerButton"
          @click="setCopilotOpen(true)"
        >
          ✨ {{ locale.aiCopilot }}
        </div>
      </div>

      <div
        :style="{ ...workareaStyles.workareaBody, margin: copilotOpen ? '16px' : '16px 48px' }"
      >
        <div :style="workareaStyles.bodyContent">
          <Image
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*48RLR41kwHIAAAAAAAAAAAAADgCCAQ/fmt.webp"
            :preview="false"
          />
          <div :style="workareaStyles.bodyText">
            <h4>What is the RICH design paradigm?</h4>
            <div>
              RICH is an AI interface design paradigm we propose, similar to how the WIMP paradigm
              relates to graphical user interfaces.
            </div>
            <br>
            <div>
              The ACM SIGCHI 2005 (the premier conference on human-computer interaction) defined
              that the core issues of human-computer interaction can be divided into three levels:
            </div>
            <ul>
              <li>
                Interface Paradigm Layer: Defines the design elements of human-computer
                interaction interfaces, guiding designers to focus on core issues.
              </li>
              <li>
                User model layer: Build an interface experience evaluation model to measure the
                quality of the interface experience.
              </li>
              <li>
                Software framework layer: The underlying support algorithms and data structures
                for human-computer interfaces, which are the contents hidden behind the front-end
                interface.
              </li>
            </ul>
            <div>
              The interface paradigm is the aspect that designers need to focus on and define the
              most when a new human-computer interaction technology is born. The interface
              paradigm defines the design elements that designers should pay attention to, and
              based on this, it is possible to determine what constitutes good design and how to
              achieve it.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :style="{ ...styles.copilotChat, width: copilotOpen ? '400px' : 0 }">
      <div :style="styles.chatHeader">
        <div :style="styles.headerTitle">
          ✨ {{ locale.aiCopilot }}
        </div>
        <Space :size="0">
          <Button
            type="text"
            :icon="h(PlusOutlined)"
            :style="styles.headerButton"
            @click="createNewSession"
          />
          <Popover
            placement="bottom"
            :overlay-inner-style="{ padding: 0, maxHeight: 600 }"
          >
            <template #content>
              <Conversations
                :items="conversationItems"
                :active-key="activeConversationKey"
                groupable
                :styles="{ item: { padding: '0 8px' } }"
                :style="styles.conversations"
                @active-change="setActiveConversationKey"
              />
            </template>
            <Button
              type="text"
              :icon="h(CommentOutlined)"
              :style="styles.headerButton"
            />
          </Popover>
          <Button
            type="text"
            :icon="h(CloseOutlined)"
            :style="styles.headerButton"
            @click="setCopilotOpen(false)"
          />
        </Space>
      </div>

      <div :style="styles.chatList">
        <Bubble.List
          v-if="messages?.length"
          ref="listRef"
          :items="bubbleItems"
          :role="role"
        />
        <template v-else>
          <Welcome
            variant="borderless"
            :title="`👋 ${locale.helloImAntDesignX}`"
            :description="locale.baseOnAntDesign"
            :style="styles.chatWelcome"
          />
          <Prompts
            vertical
            :title="locale.iCanHelp"
            :items="promptItems"
            :styles="{ title: { fontSize: 14 } }"
            @item-click="onPromptItemClick"
          />
        </template>
      </div>

      <Flex
        vertical
        :gap="12"
        :style="styles.chatSend"
      >
        <Flex
          :gap="12"
          align="center"
        >
          <Button
            :icon="h(ScheduleOutlined)"
            @click="handleUserSubmit(locale.whatHasAntDesignXUpgraded)"
          >
            {{ locale.upgrades }}
          </Button>
          <Button
            :icon="h(ProductOutlined)"
            @click="handleUserSubmit(locale.whatComponentsAreInAntDesignX)"
          >
            {{ locale.components }}
          </Button>
          <Button :icon="h(AppstoreAddOutlined)">
            {{ locale.more }}
          </Button>
        </Flex>

        <Suggestion
          :items="MOCK_SUGGESTIONS"
          @select="onSuggestionSelect"
        >
          <template #default="{ onTrigger, onKeyDown }">
            <Sender
              :loading="isRequesting"
              :value="inputValue"
              allow-speech
              :placeholder="locale.askOrInputUseSkills"
              @change="(v) => onSenderChange(onTrigger, v)"
              @submit="onSenderSubmit"
              @cancel="() => abort()"
              @key-down="onKeyDown"
              @paste-file="onPasteFile"
            >
              <template #header>
                <Sender.Header
                  :title="locale.uploadFile"
                  :styles="{ content: { padding: 0 } }"
                  :open="attachmentsOpen"
                  force-render
                  @open-change="(val) => (attachmentsOpen = val)"
                >
                  <Attachments
                    ref="attachmentsRef"
                    :before-upload="() => false"
                    :items="files"
                    :placeholder="attachmentsPlaceholder"
                    @change="onAttachmentsChange"
                  />
                </Sender.Header>
              </template>
              <template #prefix>
                <Button
                  type="text"
                  :icon="h(PaperClipOutlined, { style: { fontSize: '18px' } })"
                  @click="attachmentsOpen = !attachmentsOpen"
                />
              </template>
            </Sender>
          </template>
        </Suggestion>
      </Flex>
    </div>
  </div>
</template>
