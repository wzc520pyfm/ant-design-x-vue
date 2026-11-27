<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundUltramodernSetup' });

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
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { OpenAIOutlined } from '../../examples-v2/_shared/openai-outlined';
import { createLiveGlmProvider } from '../../examples-v2/_shared/playground-glm-provider';
import { playgroundZh as locale } from '../../examples-v2/_shared/playground-locale';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('640px', '0');
const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';

const DEFAULT_CONVERSATIONS_ITEMS = [
  { key: 'ultramodern-0', label: locale.whatIsAntDesignX, group: locale.today },
  { key: 'ultramodern-1', label: locale.howToQuicklyInstallAndImportComponents, group: locale.today },
  { key: 'ultramodern-2', label: locale.newAgiHybridInterface, group: locale.yesterday },
];

const HISTORY_MESSAGES: Record<string, DefaultMessageInfo<XModelMessage>[]> = {
  'ultramodern-1': [
    {
      message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    { message: { role: 'assistant', content: locale.aiMessage_2 }, status: 'success' },
  ],
  'ultramodern-2': [
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

const {
  conversations,
  addConversation,
  setConversations,
} = useXConversations({
  defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
});

/** Mirrors React ultramodern local `curConversation` state. */
const curConversation = ref(DEFAULT_CONVERSATIONS_ITEMS[0].key);
/** Label prefix `[当前对话]` after the first send in a session (React `activeConversation`). */
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

const Footer = defineComponent({
  name: 'PlaygroundUltramodernFooter',
  props: {
    id: { type: String, default: undefined },
    content: { type: String, default: '' },
    status: { type: String, default: undefined },
  },
  setup(props) {
    return () => {
      if (props.status === 'updating' || props.status === 'loading') return null;
      return props.id ? (
        <div style={{ display: 'flex' }}>
          <Actions
            items={[
              {
                key: 'retry',
                label: locale.retry,
                icon: <SyncOutlined />,
                onItemClick: () => {
                  if (isRequesting.value) return;
                  for (let i = messages.value.length - 1; i >= 0; i -= 1) {
                    const item = messages.value[i] as any;
                    const role = item?.message?.role ?? item?.role;
                    if (role === 'assistant') {
                      if (String(item.id) !== String(props.id)) return;
                      break;
                    }
                  }
                  onReloadRef.value?.(props.id!, { userAction: 'retry' } as never);
                },
              },
              {
                key: 'copy',
                actionRender: <Actions.Copy text={props.content} />,
              },
            ]}
          />
        </div>
      ) : null;
    };
  },
});

const getRole = (className: string): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    footer: (content: string, { status, key }: any) => (
      <Footer
        content={typeof content === 'string' ? content : ''}
        status={status}
        id={key as string}
      />
    ),
    contentRender: (content: any, { status }: { status?: string }) => {
      const text = typeof content === 'string' ? content : '';
      return (
        <XMarkdown
          paragraphTag="div"
          content={text.replace(/\n\n/g, '<br/><br/>')}
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
              curConversation.value = now;
            },
          }}
          items={conversations.value
            .map(({ key, label, ...other }) => ({
              key,
              label:
                key === activeConversation.value
                  ? `[${locale.curConversation}]${label}`
                  : label,
              ...other,
            }))
            .sort((a) => (a.key === activeConversation.value ? -1 : 0))}
          activeKey={curConversation.value}
          onActiveChange={(key: string) => {
            curConversation.value = key;
          }}
          groupable
          styles={{ item: { padding: '0 8px' } }}
          menu={(conversation: { key: string }) => ({
            items: [
              {
                label: locale.delete,
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  const next = conversations.value.filter(
                    (item) => item.key !== conversation.key,
                  );
                  setConversations(next);
                  if (conversation.key === curConversation.value) {
                    curConversation.value = next[0]?.key || '';
                  }
                },
              },
            ],
          })}
        />
      </div>

      <div style={chatStyle.value} class="ax-playground-ultramodern-chat">
        <div style={{ flex: 1, overflowY: 'auto', marginBlockStart: 16 }}>
          {messages.value.length !== 0 && (
            <Bubble.List
              styles={{ root: { maxWidth: 940, marginBlockEnd: 24 } }}
              items={messages.value.map((i) => ({
                ...i.message,
                key: i.id,
                status: i.status,
                loading: i.status === 'loading',
                extraInfo: (i.message as any).extraInfo,
              }))}
              role={getRole(shell.markdownClass.value)}
            />
          )}
        </div>
        <div
          style={{
            padding: 8,
            ...(messages.value.length === 0
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                }
              : {}),
          }}
        >
          {messages.value.length === 0 && (
            <div
              style={{
                marginBlockStart: '25%',
                fontSize: 32,
                marginBlockEnd: 38,
                fontWeight: 600,
              }}
            >
              {locale.agentName}
            </div>
          )}
          <Sender
            style={{ maxWidth: 840, width: '100%' }}
            suffix={false}
            ref={senderRef as any}
            key={curConversation.value}
            slotConfig={slotConfig}
            loading={isRequesting.value}
            onSubmit={(val: string) => {
              if (!val || isRequesting.value) return;
              onRequest({
                messages: [{ role: 'user', content: val }],
                thinking: { type: 'disabled' },
              } as never);
              activeConversation.value = curConversation.value;
              senderRef.value?.clear?.();
            }}
            onCancel={() => abort()}
            placeholder={locale.placeholder}
            footer={(actionNode: any) => (
              <Flex justify="space-between" align="center">
                <Flex gap="small" align="center">
                  <Sender.Switch
                    value={deepThink.value}
                    onChange={(checked: boolean) => {
                      deepThink.value = checked;
                    }}
                    icon={<OpenAIOutlined />}
                  >
                    {locale.deepThink}
                  </Sender.Switch>
                </Flex>
                <Flex align="center">{actionNode}</Flex>
              </Flex>
            )}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </div>
      </div>
    </Flex>
  </XProvider>
));
</script>

<style>
.ax-playground-ultramodern-chat .ant-bubble-content-updating {
  background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: bottom;
}
</style>
