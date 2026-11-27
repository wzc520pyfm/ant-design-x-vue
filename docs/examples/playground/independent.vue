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
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

interface ChatMessage extends XModelMessage {
  extraInfo?: {
    feedback: FeedbackValue;
  };
}

type ChatHandlers = {
  onReload?: ReturnType<typeof useXChat<ChatMessage>>['onReload'];
  setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
};

const shell = usePlaygroundShell('720px', '0');
const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';
const welcomeIcon = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp';

const HISTORY_MESSAGES: Record<string, DefaultMessageInfo<ChatMessage>[]> = {
  'default-1': [
    {
      message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    {
      message: { role: 'assistant', content: locale.aiMessage_2 },
      status: 'success',
    },
  ],
  'default-2': [
    { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
    { message: { role: 'assistant', content: locale.aiMessage_1 }, status: 'success' },
  ],
};

const DEFAULT_CONVERSATIONS_ITEMS = [
  { key: 'default-0', label: locale.whatIsAntDesignX, group: locale.today },
  { key: 'default-1', label: locale.howToQuicklyInstallAndImportComponents, group: locale.today },
  { key: 'default-2', label: locale.newAgiHybridInterface, group: locale.yesterday },
];

const HOT_TOPICS = {
  key: '1',
  label: locale.hotTopics,
  children: [
    { key: '1-1', description: locale.whatComponentsAreInAntDesignX, icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span> },
    { key: '1-2', description: locale.newAgiHybridInterface, icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span> },
    { key: '1-3', description: locale.whatComponentsAreInAntDesignX, icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span> },
    { key: '1-4', description: locale.comeAndDiscoverNewDesignParadigm, icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span> },
    { key: '1-5', description: locale.howToQuicklyInstallAndImportComponents, icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span> },
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
            if (props.id != null) {
              chatHandlers.value.onReload?.(String(props.id), { userAction: 'retry' } as never);
            }
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
      const newContent = text.replace(/\n\n/g, '<br/><br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          content={newContent}
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
  () => [onReload, setMessage],
  () => {
    chatHandlers.value = { onReload, setMessage };
  },
  { immediate: true },
);

function onSubmit(val: string) {
  if (!val) return;
  onRequest({
    messages: [{ role: 'user', content: val }],
  });
  listRef.value?.scrollTo?.({ top: 'bottom' });
}

const cardStyle = {
  flex: 1,
  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
  borderRadius: '12px',
  border: 'none',
};

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
  justifyContent: 'space-between',
  minWidth: 0,
}));

defineRender(() => (
  <XProvider>
    <Flex style={shell.shellStyle.value}>
      <div style={sideStyle.value}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0', padding: '0 12px' }}>
          <img src={logo} width={24} height={24} alt="logo" draggable={false} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Ant Design X</span>
        </div>
        <Conversations
          style={{ flex: 1, overflowY: 'auto', marginTop: 12 }}
          creation={{
            onClick: () => {
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
              setActiveConversationKey(now);
            },
          }}
          items={conversations.value.map(({ key, label, ...other }) => ({
            key,
            label: key === activeConversationKey.value ? `[${locale.curConversation}]${label}` : label,
            ...other,
          }))}
          activeKey={activeConversationKey.value}
          onActiveChange={(key: string) => setActiveConversationKey(key)}
          groupable
          styles={{ item: { padding: '0 8px' } }}
          menu={(conversation: { key: string }) => ({
            items: [
              { label: locale.rename, key: 'rename', icon: <EditOutlined /> },
              {
                label: locale.delete,
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  const next = conversations.value.filter((item) => item.key !== conversation.key);
                  const nextKey = next[0]?.key;
                  setConversations(next);
                  if (conversation.key === activeConversationKey.value) {
                    setActiveConversationKey(nextKey);
                  }
                },
              },
            ],
          })}
        />
        <div style={{ borderTop: '1px solid var(--ant-color-border-secondary, #f0f0f0)', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              styles={{ root: { maxWidth: 940 } }}
              role={getRole(shell.markdownClass.value)}
            />
          ) : (
            <Flex vertical style={{ maxWidth: 840, width: '100%', padding: 24, boxSizing: 'border-box' }} gap={16} align="center">
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
                  items={[HOT_TOPICS]}
                  styles={{
                    list: { height: '100%' },
                    item: cardStyle,
                    subItem: { padding: 0, background: 'transparent' },
                  }}
                  onItemClick={(info: { data: { description?: string } }) => onSubmit(String(info.data.description || ''))}
                />
                <Prompts
                  items={[DESIGN_GUIDE]}
                  styles={{
                    item: cardStyle,
                    subItem: { background: '#ffffffa6' },
                  }}
                  onItemClick={(info: { data: { description?: string } }) => onSubmit(String(info.data.description || ''))}
                />
              </Flex>
            </Flex>
          )}
        </div>

        <Flex vertical gap={12} align="center" style={{ margin: 8 }}>
          {!attachmentsOpen.value && (
            <Prompts
              items={SENDER_PROMPTS}
              onItemClick={(info: { data: { description?: string } }) => onSubmit(String(info.data.description || ''))}
              styles={{ item: { padding: '6px 12px' } }}
              style={{ width: '100%', maxWidth: 840 }}
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
              onSubmit(inputValue.value);
              inputValue.value = '';
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
    </Flex>
  </XProvider>
));
</script>
