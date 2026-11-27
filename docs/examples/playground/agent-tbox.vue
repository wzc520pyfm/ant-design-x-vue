<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundAgentTbox' });

import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  HeartOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import type { BubbleListProps, ThoughtChainItemProps } from 'ant-design-x-vue';
import {
  Actions,
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
} from 'ant-design-x-vue';
import { Avatar, Button, Flex, Pagination, Space, message } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import dayjs from 'dayjs';
import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  toRef,
  watch,
} from 'vue';
import type { Ref } from 'vue';
import { createLiveTboxProvider } from '../../examples-v2/_shared/mock-tbox-provider';
import type { TboxMessage, TboxOutput } from '../../examples-v2/_shared/mock-tbox-provider';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

type FeedbackValue = 'like' | 'dislike' | 'default';

const t = {
  whatIsTbox: '什么是百宝箱 Tbox.cn?',
  whatCanTboxDo: '百宝箱可以做什么?',
  today: '今天',
  yesterday: '昨天',
  hotTopics: '最热话题',
  designGuide: '设计指南',
  intent: '意图',
  role: '角色',
  aiUnderstandsUserNeeds: 'AI 理解用户需求并提供解决方案',
  aiPublicImage: 'AI 的公众形象',
  dynamic: '动态',
  component: '组件',
  guide: '指南',
  tutorial: '教程',
  newConversation: '新会话',
  rename: '重命名',
  delete: '删除',
  helloAntdXTboxAgent: '你好， 我是 Ant Design X & 百宝箱智能体',
  antdXTboxDescription:
    '基于 Ant Design 的 AGI 产品界面解决方案，打造更卓越的智能视觉体验，集成了百宝箱 Tbox.cn 的智能体能力，助力产品设计与开发。',
  askMeAnything: '向我提问吧',
  DeepThinking: '深度思考中',
  CompleteThinking: '深度思考完成',
  noData: '暂无数据',
  modelIsRunning: '正在调用模型',
  modelExecutionCompleted: '大模型执行完成',
  executionFailed: '执行失败',
  aborted: '已经终止',
  curConversation: '当前对话',
  nowNenConversation: '当前已经是新会话',
  isMock: '当前为模拟功能',
  retry: '重新生成',
  AbortThinking: '思考已中止',
  ErrThinking: '思考出错',
};

const shell = usePlaygroundShell('720px', '16px');
const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';
const welcomeIcon = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp';

const DEFAULT_CONVERSATIONS_ITEMS = [
  { key: 'tbox-0', label: t.whatIsTbox, group: t.today },
  { key: 'tbox-1', label: t.whatCanTboxDo, group: t.yesterday },
];

const HOT_TOPICS = {
  key: '1',
  label: t.hotTopics,
  children: [
    {
      key: '1-1',
      description: t.whatIsTbox,
      icon: h('span', { style: { color: '#f93a4a', fontWeight: 700 } }, '1'),
    },
    {
      key: '1-2',
      description: t.whatCanTboxDo,
      icon: h('span', { style: { color: '#ff6565', fontWeight: 700 } }, '2'),
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: t.designGuide,
  children: [
    {
      key: '2-1',
      icon: h(HeartOutlined),
      label: t.intent,
      description: t.aiUnderstandsUserNeeds,
    },
    {
      key: '2-2',
      icon: h(SmileOutlined),
      label: t.role,
      description: t.aiPublicImage,
    },
  ],
};

const SENDER_PROMPTS = [
  { key: '1', description: t.dynamic, icon: h(ScheduleOutlined) },
  { key: '2', description: t.component, icon: h(AppstoreOutlined) },
  { key: '3', description: t.guide, icon: h(FileSearchOutlined) },
  { key: '4', description: t.tutorial, icon: h(AppstoreAddOutlined) },
];

const ThoughtChainConfig = {
  loading: { title: t.modelIsRunning, status: 'loading' as const },
  updating: { title: t.modelIsRunning, status: 'loading' as const },
  success: { title: t.modelExecutionCompleted, status: 'success' as const },
  error: { title: t.executionFailed, status: 'error' as const },
  abort: { title: t.aborted, status: 'abort' as const },
};

type ChatHandlers = {
  onReload?: ReturnType<typeof useXChat>['onReload'];
};

const chatHandlers = ref<ChatHandlers>({});
const MessageContextKey = 'ax-tbox-message-status';

const MessageStatusProvider = defineComponent({
  name: 'AXTboxMessageStatusProviderSetup',
  props: {
    chatStatus: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    provide(MessageContextKey, toRef(props, 'chatStatus'));
    return () => slots.default?.();
  },
});

const ThinkComponent = defineComponent({
  name: 'AXTboxThinkComponentSetup',
  props: {
    streamStatus: { type: String, default: 'done' },
  },
  setup(props, { slots }) {
    const chatStatus = inject<Ref<string | undefined>>(MessageContextKey, ref(undefined));
    const title = ref(`${t.DeepThinking}...`);
    const loading = ref(true);

    watch(
      () => [props.streamStatus, chatStatus.value] as const,
      ([streamStatus, status]) => {
        if (streamStatus === 'done') {
          title.value = t.CompleteThinking;
          loading.value = false;
        } else if (status === 'abort') {
          title.value = t.AbortThinking;
          loading.value = false;
        } else if (status === 'error') {
          title.value = t.ErrThinking;
          loading.value = false;
        } else {
          title.value = `${t.DeepThinking}...`;
          loading.value = true;
        }
      },
      { immediate: true },
    );

    return () =>
      h(Think, { title: title.value, loading: loading.value }, () => slots.default?.());
  },
});

const Footer = defineComponent({
  name: 'AXTboxFooterSetup',
  props: {
    id: { type: [String, Number], default: undefined },
    content: { type: String, default: '' },
    status: { type: String, default: undefined },
  },
  setup(props) {
    const mockFeedback = ref<FeedbackValue>('default');
    return () => {
      if (props.status === 'updating' || props.status === 'loading') return null;
      const items = [
        {
          key: 'pagination',
          actionRender: () => h(Pagination, { simple: true, total: 1, pageSize: 1 }),
        },
        {
          key: 'retry',
          label: t.retry,
          icon: h(SyncOutlined),
          onItemClick: () => {
            if (props.id == null || isRequesting.value) return;
            for (let i = messages.value.length - 1; i >= 0; i -= 1) {
              const item = messages.value[i] as any;
              const role = item?.message?.role ?? item?.role;
              if (role === 'assistant') {
                if (String(item.id) !== String(props.id)) return;
                break;
              }
            }
            chatHandlers.value.onReload?.(props.id, {
              userAction: 'retry',
            } as never);
          },
        },
        {
          key: 'copy',
          actionRender: () => h(Actions.Copy, { text: props.content }),
        },
        {
          key: 'audio',
          actionRender: () =>
            h(Actions.Audio, {
              onClick: () => {
                message.info(t.isMock);
              },
            }),
        },
        {
          key: 'feedback',
          actionRender: () =>
            h(Actions.Feedback, {
              styles: { liked: { color: '#f759ab' } },
              value: mockFeedback.value || 'default',
              onChange: (val: FeedbackValue) => {
                mockFeedback.value = val;
                message.success(`${props.id}: ${val}`);
              },
            }),
        },
      ];
      return props.id != null
        ? h('div', { style: { display: 'flex' } }, [h(Actions, { items })])
        : null;
    };
  },
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

const inputValue = ref('');
const listRef = ref<{ scrollTo?: (opts: { top: string }) => void } | null>(null);
const provider = createLiveTboxProvider(() =>
  String(activeConversationKey.value || DEFAULT_CONVERSATIONS_ITEMS[0].key),
);

const { onRequest, messages, isRequesting, abort, onReload } = useXChat<TboxMessage>({
  provider,
  conversationKey: activeConversationKey,
  requestPlaceholder: () => ({
    content: { text: t.noData },
    role: 'assistant',
  }),
});

watch(
  () => onReload,
  () => {
    chatHandlers.value = { onReload };
  },
  { immediate: true },
);

function onSubmit(val: string) {
  if (!val || isRequesting.value) return;
  onRequest({
    message: { role: 'user', content: val },
  });
  listRef.value?.scrollTo?.({ top: 'bottom' });
}

function ask(info: { data: { description?: string } }) {
  onSubmit(String(info.data.description || ''));
}

function asTboxContent(content: unknown): TboxOutput {
  if (content && typeof content === 'object') {
    return content as TboxOutput;
  }
  return {};
}

function buildMarkdown(content: TboxOutput) {
  const ext = content.ext_text || '';
  const text = content.text || '';
  return `${ext ? `<think>\n\n${ext}${text ? '\n\n</think>\n\n' : ''}` : ''}${text}`;
}

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    header: (_: unknown, { status }: { status?: string }) => {
      const config = ThoughtChainConfig[status as keyof typeof ThoughtChainConfig];
      return config
        ? h(ThoughtChain.Item, {
            style: { marginBottom: 8 },
            status: config.status as ThoughtChainItemProps['status'],
            variant: 'solid',
            icon: h(GlobalOutlined),
            title: config.title,
          })
        : null;
    },
    footer: (content: unknown, { status, key }: { status?: string; key?: string | number }) => {
      const data = asTboxContent(content);
      return h(Footer, {
        content: data.text || data.ext_text || '',
        status,
        id: key,
      });
    },
    contentRender: (content: unknown, { status }: { status?: string }) => {
      const data = asTboxContent(content);
      return h(MessageStatusProvider, { chatStatus: status }, () =>
        h(XMarkdown, {
          content: buildMarkdown(data),
          className: shell.markdownClass.value,
          components: { think: ThinkComponent },
          streaming: { hasNextChunk: status === 'updating', enableAnimation: true },
        }),
      );
    },
  },
  user: {
    placement: 'end',
    contentRender: (content: unknown) =>
      typeof content === 'string' ? content : asTboxContent(content).text || '',
  },
};

const conversationItems = computed(() =>
  conversations.value.map(({ key, label, ...other }) => ({
    key,
    label: key === activeConversationKey.value ? `[${t.curConversation}]${label}` : label,
    ...other,
  })),
);

const bubbleItems = computed(() =>
  messages.value.map((i) => ({
    ...i.message,
    key: i.id,
    status: i.status,
    loading: i.status === 'loading',
  })),
);

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
  paddingBlock: '24px',
  paddingInline: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
  minWidth: 0,
  boxSizing: 'border-box' as const,
}));

const cardStyle = {
  flex: 1,
  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
  borderRadius: '12px',
  border: 'none',
};

const hotTopicsStyles = {
  list: { height: '100%' },
  item: cardStyle,
  subItem: { padding: 0, background: 'transparent' },
};

const designGuideStyles = {
  item: cardStyle,
  subItem: { background: '#ffffffa6' },
};

const welcomeExtra = () =>
  h(Space, null, () => [
    h(Button, { icon: h(ShareAltOutlined) }),
    h(Button, { icon: h(EllipsisOutlined) }),
  ]);

const helpIcon = h(QuestionCircleOutlined);

function onCreateConversation() {
  if (!messages.value.length) {
    message.error(t.nowNenConversation);
    return;
  }
  const now = dayjs().valueOf().toString();
  addConversation({
    key: now,
    label: `${t.newConversation} ${conversations.value.length + 1}`,
    group: t.today,
  });
  setActiveConversationKey(now);
}

function conversationMenu(conversation: { key: string }) {
  return {
    items: [
      { label: t.rename, key: 'rename', icon: h(EditOutlined) },
      {
        label: t.delete,
        key: 'delete',
        icon: h(DeleteOutlined),
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
  };
}

function sendCurrent() {
  onSubmit(inputValue.value);
  inputValue.value = '';
}

defineRender(() => (
  <XProvider>
    <Flex style={shell.shellStyle.value}>
      <div style={sideStyle.value}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '24px 0', padding: '0 24px' }}>
          <img src={logo} width={24} height={24} alt="logo" draggable={false} />
          <span style={{ fontWeight: 700, fontSize: '16px' }}>Ant Design X</span>
        </div>
        <Conversations
          style={{ flex: 1, overflowY: 'auto', marginTop: '12px' }}
          creation={{ onClick: onCreateConversation }}
          items={conversationItems.value}
          activeKey={activeConversationKey.value}
          onActiveChange={setActiveConversationKey}
          groupable
          styles={{ item: { padding: '0 8px' } }}
          menu={conversationMenu}
        />
        <div
          style={{
            borderTop: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Avatar size={24} />
          <Button type="text" icon={helpIcon} />
        </div>
      </div>

      <div class="ax-tbox-chat" style={chatStyle.value}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {messages.value.length ? (
            <Bubble.List
              ref={listRef as any}
              items={bubbleItems.value}
              styles={{ root: { maxWidth: 940 } }}
              role={role}
            />
          ) : (
            <Flex
              vertical
              gap={16}
              align="center"
              style={{ maxWidth: '840px', width: '100%', padding: '24px', boxSizing: 'border-box' }}
            >
              <Welcome
                class="ax-tbox-welcome"
                variant="borderless"
                icon={welcomeIcon}
                title={t.helloAntdXTboxAgent}
                description={t.antdXTboxDescription}
                styles={{ icon: { height: '64px' } }}
                extra={welcomeExtra}
              />
              <Flex gap={16} style={{ width: '100%' }}>
                <Prompts
                  class="ax-tbox-prompts"
                  items={[HOT_TOPICS]}
                  styles={hotTopicsStyles}
                  onItemClick={ask}
                />
                <Prompts
                  class="ax-tbox-prompts"
                  items={[DESIGN_GUIDE]}
                  styles={designGuideStyles}
                  onItemClick={ask}
                />
              </Flex>
            </Flex>
          )}
        </div>

        <Flex vertical gap={12} justify="center" style={{ marginInline: '24px' }}>
          <Prompts
            items={SENDER_PROMPTS}
            onItemClick={ask}
            styles={{ item: { padding: '6px 12px' } }}
            style={{ width: '100%', maxWidth: '840px', margin: '0 auto' }}
          />
          <Sender
            style={{ width: '100%', maxWidth: '840px', margin: '0 auto' }}
            value={inputValue.value}
            loading={isRequesting.value}
            placeholder={t.askMeAnything}
            onUpdate:value={(v: string) => { inputValue.value = v; }}
            onSubmit={sendCurrent}
            onCancel={() => abort()}
          />
        </Flex>
      </div>
    </Flex>
  </XProvider>
));
</script>

<style>

.ax-tbox-chat :deep(.ant-bubble-content-updating) {
  background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: bottom;
}
.ax-tbox-welcome .ant-welcome-icon {
  flex-shrink: 0;
}
.ax-tbox-welcome .ant-welcome-icon img {
  width: auto;
  height: 100%;
  object-fit: contain;
}
.ax-tbox-prompts {
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  align-self: stretch;
}
.ax-tbox-prompts .ant-prompts {
  height: 100%;
}
.ax-tbox-prompts .ant-prompts-list {
  height: 100%;
}
.ax-tbox-prompts .ant-prompts-label {
  color: rgba(0, 0, 0, 0.88) !important;
}
.ax-tbox-prompts .ant-prompts-desc,
.ax-tbox-prompts .ant-prompts-icon {
  color: rgba(0, 0, 0, 0.65) !important;
}
</style>
