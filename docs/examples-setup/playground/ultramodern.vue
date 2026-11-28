<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundUltramodern' });

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

/** React docs: compact iframe="800" */
const shell = usePlaygroundShell('800px', '0');
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

function switchConversation(key: string) {
  if (key === curConversation.value) return;
  if (isRequesting.value || provider.request.isRequesting) {
    abort();
  }
  curConversation.value = key;
}

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

const chatStyle = computed(() => ({
  ...shell.mainStyle.value,
  padding: 0,
  height: '100%',
  width: 'calc(100% - 280px)',
  display: 'flex',
  flexDirection: 'column' as const,
  minWidth: 0,
  overflow: 'auto',
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
              if (messages.value.length === 0 && curConversation.value) {
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
          onActiveChange={(key: string) => switchConversation(key)}
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
                  if (conversation.key === curConversation.value) {
                    switchConversation(next[0].key);
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
          class={
            messages.value.length === 0
              ? 'ax-playground-ultramodern-sender ax-playground-ultramodern-sender--start'
              : 'ax-playground-ultramodern-sender'
          }
        >
          {messages.value.length === 0 && (
            <div class="ax-playground-ultramodern-agent-name">{locale.agentName}</div>
          )}
          <Sender
            style={{ maxWidth: 840, width: '100%' }}
            suffix={false}
            ref={senderRef as any}
            key={curConversation.value}
            slotConfig={slotConfig}
            loading={isRequesting.value}
            onSubmit={(val: string) => {
              if (!val || !curConversation.value) return;
              if (isRequesting.value || provider.request.isRequesting) return;
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
    </div>
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

/* React ultramodern: chatSender paddingXS + startPage center; docs hosts are
   narrower than Ant Design X's iframe, so add horizontal inset for breathing room. */
.ax-playground-ultramodern-sender {
  padding: 8px 24px;
  box-sizing: border-box;
  width: 100%;
}

.ax-playground-ultramodern-sender--start {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

/* Explicit px so VitePress host font metrics cannot shrink the title.
   Color inherits from .ax-playground-root (token.colorText) for light/dark. */
.ax-playground-ultramodern-agent-name {
  margin-block-start: 25%;
  margin-block-end: 38px;
  font-size: 32px !important;
  line-height: 1.2;
  font-weight: 600;
  color: inherit;
}
</style>
