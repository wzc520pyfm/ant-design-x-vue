<script setup lang="tsx">
defineOptions({ name: 'PlaygroundIndependent' });

import {
  AppstoreAddOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  HeartOutlined,
  PaperClipOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import type { BubbleListProps, ThoughtChainItemProps } from 'ant-design-x-vue';
import {
  Actions,
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
  XProvider,
  useXChat,
  useXConversations,
  type DefaultMessageInfo,
  type XModelMessage,
} from 'ant-design-x-vue';
type FeedbackValue = 'like' | 'dislike' | 'default';
import { Avatar, Button, Flex, Pagination, Space, message } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import dayjs from 'dayjs';
import { computed, defineComponent, provide, ref, watch } from 'vue';
import { createLiveGlmProvider } from '../../examples-v2/_shared/playground-glm-provider';
import { playgroundZh as locale } from '../../examples-v2/_shared/playground-locale';
import { isDarkColor, usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

interface ChatMessage extends XModelMessage {
  extraInfo?: {
    feedback: FeedbackValue;
  };
}

type ChatHandlers = {
  onReload?: ReturnType<typeof useXChat<ChatMessage>>['onReload'];
  setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
  isBusy?: () => boolean;
  isLatestAssistant?: (id: string | number) => boolean;
};

/** React docs: compact iframe="800" */
const shell = usePlaygroundShell('800px', '0');
const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';
const welcomeIcon = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp';

const HISTORY_MESSAGES: Record<string, DefaultMessageInfo<ChatMessage>[]> = {
  'independent-1': [
    {
      message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    {
      message: { role: 'assistant', content: locale.aiMessage_2 },
      status: 'success',
    },
  ],
  'independent-2': [
    { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
    { message: { role: 'assistant', content: locale.aiMessage_1 }, status: 'success' },
  ],
};

const DEFAULT_CONVERSATIONS_ITEMS = [
  { key: 'independent-0', label: locale.whatIsAntDesignX, group: locale.today },
  { key: 'independent-1', label: locale.howToQuicklyInstallAndImportComponents, group: locale.today },
  { key: 'independent-2', label: locale.newAgiHybridInterface, group: locale.yesterday },
];

const HOT_TOPICS = {
  key: '1',
  label: locale.hotTopics,
  children: [
    { key: '1-1', description: locale.whatComponentsAreInAntDesignX, icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span> },
    { key: '1-2', description: locale.newAgiHybridInterface, icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span> },
    { key: '1-3', description: locale.whatComponentsAreInAntDesignX, icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span> },
    { key: '1-4', description: locale.comeAndDiscoverNewDesignParadigm, icon: <span style={{ opacity: 0.6, fontWeight: 700 }}>4</span> },
    { key: '1-5', description: locale.howToQuicklyInstallAndImportComponents, icon: <span style={{ opacity: 0.6, fontWeight: 700 }}>5</span> },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: locale.designGuide,
  children: [
    { key: '2-1', icon: <HeartOutlined />, label: locale.intention, description: locale.aiUnderstandsUserNeedsAndProvidesSolutions },
    { key: '2-2', icon: <SmileOutlined />, label: locale.role, description: locale.aiPublicPersonAndImage },
    { key: '2-3', icon: <CommentOutlined />, label: locale.chat, description: locale.howAICanExpressItselfWayUsersUnderstand },
    { key: '2-4', icon: <PaperClipOutlined />, label: locale.interface, description: locale.aiBalances },
  ],
};

const SENDER_PROMPTS = [
  { key: '1', description: locale.upgrades, icon: <ScheduleOutlined /> },
  { key: '2', description: locale.components, icon: <AppstoreOutlined /> },
  { key: '3', description: locale.richGuide, icon: <FileSearchOutlined /> },
  { key: '4', description: locale.installationIntroduction, icon: <AppstoreAddOutlined /> },
];

const THOUGHT_CHAIN_CONFIG = {
  loading: { title: locale.modelIsRunning, status: 'loading' as const },
  updating: { title: locale.modelIsRunning, status: 'loading' as const },
  success: { title: locale.modelExecutionCompleted, status: 'success' as const },
  error: { title: locale.executionFailed, status: 'error' as const },
  abort: { title: locale.aborted, status: 'abort' as const },
};

const historyMessageFactory = (conversationKey: string) => HISTORY_MESSAGES[conversationKey] || [];

const chatHandlers = ref<ChatHandlers>({});
provide('playgroundChatHandlers', chatHandlers);

const ThinkComponent = defineComponent({
  name: 'PlaygroundIndependentThink',
  props: {
    streamStatus: { type: String, default: 'done' },
  },
  setup(props, { slots }) {
    return () => (
      <Think
        title={props.streamStatus === 'done' ? locale.completeThinking : `${locale.deepThinking}...`}
        loading={props.streamStatus !== 'done'}
      >
        {slots.default?.()}
      </Think>
    );
  },
});

const Footer = defineComponent({
  name: 'PlaygroundIndependentFooter',
  props: {
    id: { type: [String, Number], default: undefined },
    content: { type: String, default: '' },
    status: { type: String, default: undefined },
    extraInfo: { type: Object as () => ChatMessage['extraInfo'], default: undefined },
  },
  setup(props) {
    return () => {
      if (props.status === 'updating' || props.status === 'loading') return null;
      const items = [
        {
          key: 'pagination',
          actionRender: <Pagination simple total={1} pageSize={1} />,
        },
        {
          key: 'retry',
          label: locale.retry,
          icon: <SyncOutlined />,
          onItemClick: () => {
            if (props.id == null) return;
            if (chatHandlers.value.isBusy?.()) return;
            if (!chatHandlers.value.isLatestAssistant?.(props.id)) return;
            chatHandlers.value.onReload?.(String(props.id), { userAction: 'retry' } as never);
          },
        },
        {
          key: 'copy',
          actionRender: <Actions.Copy text={props.content} />,
        },
        {
          key: 'audio',
          actionRender: (
            <Actions.Audio onClick={() => { message.info(locale.isMock); }} />
          ),
        },
        {
          key: 'feedback',
          actionRender: (
            <Actions.Feedback
              styles={{ liked: { color: '#f759ab' } }}
              value={props.extraInfo?.feedback || 'default'}
              onChange={(val) => {
                if (props.id != null) {
                  chatHandlers.value.setMessage?.(String(props.id), () => ({
                    extraInfo: { feedback: val },
                  }));
                  message.success(`${props.id}: ${val}`);
                } else {
                  message.error('has no id!');
                }
              }}
            />
          ),
        },
      ];
      return props.id != null ? (
        <div style={{ display: 'flex' }}>
          <Actions items={items} />
        </div>
      ) : null;
    };
  },
});

const getRole = (className: string): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    header: (_: unknown, { status }: { status?: string }) => {
      const config = THOUGHT_CHAIN_CONFIG[status as keyof typeof THOUGHT_CHAIN_CONFIG];
      return config ? (
        <ThoughtChain.Item
          style={{ marginBottom: 8 }}
          status={config.status as ThoughtChainItemProps['status']}
          variant="solid"
          icon={<GlobalOutlined />}
          title={config.title}
        />
      ) : null;
    },
    footer: (content: string, { status, key, extraInfo }: any) => (
      <Footer
        content={typeof content === 'string' ? content : ''}
        status={status}
        extraInfo={extraInfo as ChatMessage['extraInfo']}
        id={key as string}
      />
    ),
    contentRender: (content: any, { status }: { status?: string }) => {
      const text = typeof content === 'string' ? content : '';
      // Keep blank lines so Markdown headings / hr / lists parse as blocks.
      return (
        <XMarkdown
          paragraphTag="div"
          content={text}
          components={{ think: ThinkComponent }}
          className={className}
          streaming={{
            hasNextChunk: status === 'updating',
            enableAnimation: true,
          }}
        />
      );
    },
  },
  user: { placement: 'end' },
});

const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
  setConversations,
} = useXConversations({
  defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
});

const provider = createLiveGlmProvider(() => activeConversationKey.value, { thinkingDisabled: true });

const attachmentsOpen = ref(false);
const attachedFiles = ref<any[]>([]);
const inputValue = ref('');
const listRef = ref<{ scrollTo?: (opts: { top: string }) => void } | null>(null);

const { onRequest, messages, isRequesting, abort, onReload, setMessage } = useXChat<ChatMessage>({
  provider,
  conversationKey: activeConversationKey,
  defaultMessages: ({ conversationKey }) => historyMessageFactory(String(conversationKey ?? '')),
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
  () => [onReload, setMessage, messages.value, isRequesting.value],
  () => {
    chatHandlers.value = {
      onReload,
      setMessage,
      isBusy: () => isRequesting.value,
      isLatestAssistant: (id) => {
        for (let i = messages.value.length - 1; i >= 0; i -= 1) {
          const item = messages.value[i] as any;
          const role = item?.message?.role ?? item?.role;
          if (role === 'assistant') {
            return String(item.id) === String(id);
          }
        }
        return false;
      },
    };
  },
  { immediate: true },
);

function onSubmit(val: string) {
  if (!val || !activeConversationKey.value) return false;
  if (isRequesting.value || provider.request.isRequesting) return false;
  onRequest({
    messages: [{ role: 'user', content: val }],
  });
  listRef.value?.scrollTo?.({ top: 'bottom' });
  return true;
}

function switchConversation(key: string | undefined) {
  if (key === activeConversationKey.value) return;
  if (isRequesting.value || provider.request.isRequesting) {
    abort();
  }
  setActiveConversationKey(key as string);
}

/** Match original Vue independent: light vs dark prompt card gradients. */
const isDarkTheme = computed(() => isDarkColor(shell.token.value.colorBgContainer));

const promptCardStyle = computed(() => ({
  flex: '1 1 0',
  minWidth: 0,
  backgroundImage: isDarkTheme.value
    ? 'linear-gradient(123deg, #1e2a38 0%, #2b1f3b 100%)'
    : 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
  borderRadius: '12px',
  border: 'none',
}));

const chatPadPx = computed(() => {
  const pad = shell.token.value.paddingLG ?? 24;
  return typeof pad === 'number' ? `${pad}px` : String(pad);
});

const chatStyle = computed(() => ({
  ...shell.mainStyle.value,
  // Original Vue independent: paddingLG on the chat column so Bubble + Sender share side inset.
  // Explicit px strings — unitless padding*/gap can be dropped by Vue style normalize.
  paddingInline: chatPadPx.value,
  paddingBlock: chatPadPx.value,
  height: '100%',
  width: 'calc(100% - 280px)',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
  gap: '16px',
  minWidth: 0,
  boxSizing: 'border-box' as const,
}));

const placeholderStyle = computed(() => ({
  maxWidth: 840,
  width: '100%',
  paddingTop: '32px',
  boxSizing: 'border-box' as const,
}));

const sideFooterStyle = computed(() => ({
  borderTop: `1px solid ${shell.token.value.colorBorderSecondary}`,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

defineRender(() => (
  <XProvider>
    <div class="ax-playground-root" style={shell.shellStyle.value}>
      <div style={shell.sideStyle.value}>
        <div style={shell.logoStyle.value}>
          <img src={logo} width={24} height={24} alt="logo" draggable={false} />
          <span style={{ fontWeight: 700, fontSize: 16, color: 'inherit' }}>Ant Design X</span>
        </div>
        <Conversations
          style={{ flex: 1, overflowY: 'auto', marginTop: 12, padding: 0 }}
          creation={{
            onClick: () => {
              // Allow create when no conversation is active (e.g. after deleting the last one).
              if (messages.value.length === 0 && activeConversationKey.value) {
                message.error(locale.itIsNowANewConversation);
                return;
              }
              const now = dayjs().valueOf().toString();
              addConversation({
                key: now,
                label: `${locale.newConversation} ${conversations.value.length + 1}`,
                group: locale.today,
              });
              switchConversation(now);
            },
          }}
          items={conversations.value.map(({ key, label, ...other }) => ({
            key,
            label: key === activeConversationKey.value ? `[${locale.curConversation}]${label}` : label,
            ...other,
          }))}
          activeKey={activeConversationKey.value}
          onActiveChange={(key: string) => switchConversation(key)}
          groupable
          styles={{ item: { padding: '0 8px' } }}
          menu={(conversation: { key: string; label?: unknown }) => ({
            items: [
              {
                label: locale.rename,
                key: 'rename',
                icon: <EditOutlined />,
                onClick: () => {
                  const current = String(
                    conversations.value.find((item) => item.key === conversation.key)?.label ?? '',
                  );
                  const next = window.prompt(locale.rename, current)?.trim();
                  if (!next) return;
                  setConversations(
                    conversations.value.map((item) =>
                      item.key === conversation.key ? { ...item, label: next } : item,
                    ),
                  );
                },
              },
              {
                label: locale.delete,
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  const next = conversations.value.filter((item) => item.key !== conversation.key);
                  if (!next.length) {
                    const now = dayjs().valueOf().toString();
                    setConversations([
                      {
                        key: now,
                        label: `${locale.newConversation} 1`,
                        group: locale.today,
                      },
                    ]);
                    switchConversation(now);
                    return;
                  }
                  setConversations(next);
                  if (conversation.key === activeConversationKey.value) {
                    switchConversation(next[0].key);
                  }
                },
              },
            ],
          })}
        />
        <div style={sideFooterStyle.value}>
          <Avatar size={24} />
          <Button type="text" icon={<QuestionCircleOutlined />} />
        </div>
      </div>

      <div style={chatStyle.value}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {messages.value.length ? (
            <Bubble.List
              ref={listRef as any}
              items={messages.value.map((i) => ({
                ...i.message,
                key: i.id,
                status: i.status,
                loading: i.status === 'loading',
                extraInfo: i.extraInfo,
              }))}
              styles={{ root: { maxWidth: 940, width: '100%' } }}
              style={{ height: '100%', maxWidth: 840, width: '100%', margin: '0 auto' }}
              role={getRole(shell.markdownClass.value)}
            />
          ) : (
            <Flex vertical style={placeholderStyle.value} gap={16} align="center">
              <Welcome
                style={{ width: '100%' }}
                variant="borderless"
                icon={welcomeIcon}
                title={locale.welcome}
                description={locale.welcomeDescription}
                extra={(
                  <Space>
                    <Button icon={<ShareAltOutlined />} />
                    <Button icon={<EllipsisOutlined />} />
                  </Space>
                )}
              />
              <Flex gap={16} justify="center" style={{ width: '100%' }}>
                <Prompts
                  class="ax-playground-chat-prompt"
                  items={[HOT_TOPICS]}
                  styles={{
                    list: { height: '100%' },
                    item: promptCardStyle.value,
                    subItem: { padding: 0, background: 'transparent', maxWidth: '100%' },
                  }}
                  onItemClick={(info: { data: { description?: string } }) => onSubmit(String(info.data.description || ''))}
                />
                <Prompts
                  class="ax-playground-chat-prompt"
                  items={[DESIGN_GUIDE]}
                  styles={{
                    item: promptCardStyle.value,
                    subItem: {
                      background: isDarkTheme.value ? undefined : '#ffffffa6',
                      maxWidth: '100%',
                    },
                  }}
                  onItemClick={(info: { data: { description?: string } }) => onSubmit(String(info.data.description || ''))}
                />
              </Flex>
            </Flex>
          )}
        </div>

        <Flex vertical gap={12} align="center" style={{ width: '100%', boxSizing: 'border-box' }}>
          {!attachmentsOpen.value && (
            <Prompts
              items={SENDER_PROMPTS}
              onItemClick={(info: { data: { description?: string } }) => onSubmit(String(info.data.description || ''))}
              styles={{ item: { padding: '6px 12px', maxWidth: '100%' } }}
              style={{ width: '100%', maxWidth: 840, color: 'inherit' }}
            />
          )}
          <Sender
            style={{ width: '100%', maxWidth: 840 }}
            value={inputValue.value}
            header={(
              <Sender.Header
                title={locale.uploadFile}
                open={attachmentsOpen.value}
                onOpenChange={(open: boolean) => { attachmentsOpen.value = open; }}
                styles={{ content: { padding: 0 } }}
              >
                <Attachments
                  beforeUpload={() => false}
                  items={attachedFiles.value}
                  onChange={(info: { fileList: any[] }) => { attachedFiles.value = info.fileList; }}
                  placeholder={(type: string) =>
                    type === 'drop'
                      ? { title: locale.dropFileHere }
                      : {
                          icon: <CloudUploadOutlined />,
                          title: locale.uploadFiles,
                          description: locale.clickOrDragFilesToUpload,
                        }
                  }
                />
              </Sender.Header>
            )}
            onSubmit={() => {
              if (onSubmit(inputValue.value)) {
                inputValue.value = '';
              }
            }}
            onUpdate:value={(v: string) => { inputValue.value = v; }}
            onCancel={() => abort()}
            prefix={(
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => { attachmentsOpen.value = !attachmentsOpen.value; }}
              />
            )}
            loading={isRequesting.value}
            allowSpeech
            placeholder={locale.askOrInputUseSkills}
          />
        </Flex>
      </div>
    </div>
  </XProvider>
));
</script>
