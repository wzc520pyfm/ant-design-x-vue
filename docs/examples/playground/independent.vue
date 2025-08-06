<script setup lang="tsx">
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  Conversations,
  Prompts,
  type PromptsProps,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from 'ant-design-x-vue';
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { Avatar, Button, Flex, message, Space, Spin, theme } from 'ant-design-vue';
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useData } from 'vitepress'

type BubbleDataType = {
  role: string;
  content: string;
};

defineOptions({ name: 'PlaygroundIndependent' });

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: 'What is Ant Design X Vue?',
    group: 'Today',
  },
  {
    key: 'default-1',
    label: 'How to quickly install and import components?',
    group: 'Today',
  },
  {
    key: 'default-2',
    label: 'New AGI Hybrid Interface',
    group: 'Yesterday',
  },
];

const HOT_TOPICS = {
  key: '1',
  label: 'Hot Topics',
  children: [
    {
      key: '1-1',
      description: 'What has Ant Design X Vue upgraded?',
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: 'New AGI Hybrid Interface',
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: 'What components are in Ant Design X Vue?',
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: 'Come and discover the new design paradigm of the AI era.',
      icon: <span style={{ opacity: 0.6, fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: 'How to quickly install and import components?',
      icon: <span style={{ opacity: 0.6, fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: 'Design Guide',
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: 'Intention',
      description: 'AI understands user needs and provides solutions.',
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: 'Role',
      description: "AI's public persona and image",
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: 'Chat',
      description: 'How AI Can Express Itself in a Way Users Understand',
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: 'Interface',
      description: 'AI balances "chat" & "do" behaviors.',
    },
  ],
};

const SENDER_PROMPTS: PromptsProps['items'] = [
  {
    key: '1',
    description: 'Upgrades',
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: 'Components',
    icon: <AppstoreOutlined />,
  },
  {
    key: '3',
    description: 'RICH Guide',
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: 'Installation Introduction',
    icon: <AppstoreAddOutlined />,
  },
];

// ==================== Style ====================
const { token } = theme.useToken();
const styles = computed(() => {
  return {
    layout: {
      width: '100%',
      'min-width': '1000px',
      height: '722px',
      display: 'flex',
      background: `${token.value.colorBgContainer}`,
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    // sider 样式
    sider: {
      background: `${token.value.colorBgLayout}80`,
      width: '280px',
      height: '100%',
      display: 'flex',
      'flex-direction': 'column',
      padding: '0 12px',
      'box-sizing': 'border-box',
    },
    logo: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'start',
      padding: '0 24px',
      'box-sizing': 'border-box',
      gap: '8px',
      margin: '24px 0',
    },
    logoTitle: {
      'font-weight': 'bold',
      color: `${token.value.colorText}`,
      'font-size': '16px',
    },
    addBtn: {
      background: '#1677ff0f',
      border: '1px solid #1677ff34',
      height: '40px',
    },
    conversations: {
      flex: 1,
      'overflow-y': 'auto',
      'margin-top': '12px',
      padding: 0,
    },
    siderFooter: {
      'border-top': `1px solid ${token.value.colorBorderSecondary}`,
      height: '40px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
    },
    // chat list 样式
    chat: {
      height: '100%',
      width: '100%',
      'box-sizing': 'border-box',
      display: 'flex',
      'flex-direction': 'column',
      'padding-block': `${token.value.paddingLG}px`,
      gap: '16px',
    },
    chatList: {
      flex: 1,
      overflow: 'auto',
    },
    loadingMessage: {
      'background-image': 'linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%)',
      'background-size': '100% 2px',
      'background-repeat': 'no-repeat',
      'background-position': 'bottom',
    },
    placeholder: {
      'padding-top': '32px',
    },
    // sender 样式
    sender: {
      width: '100%',
      'max-width': '700px',
      margin: '0 auto',
    },
    speechButton: {
      'font-size': '18px',
      color: `${token.value.colorText} !important`,
    },
    senderPrompt: {
      width: '100%',
      'max-width': '700px',
      margin: '0 auto',
      color: `${token.value.colorText}`,
    },
  } as const
});

const { isDark } = useData();

// ==================== State ====================
const abortController = ref<AbortController | null>(null);

const messageHistory = ref<Record<string, any>>({});

const conversations = ref(DEFAULT_CONVERSATIONS_ITEMS);
const curConversation = ref(DEFAULT_CONVERSATIONS_ITEMS[0].key);

const attachmentsOpen = ref(false);
const attachedFiles = ref<AttachmentsProps['items']>([]);

const inputValue = ref('');

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
// ==================== Runtime ====================
const [agent] = useXAgent<BubbleDataType>({
  baseURL: 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b',
  model: 'DeepSeek-R1-Distill-Qwen-7B',
  dangerouslyApiKey: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
});

const loading = ref(false);
watch(() => agent.value.isRequesting(), () => {
  loading.value = agent.value.isRequesting();
});

const { onRequest, messages, setMessages } = useXChat({
  agent: agent.value,
  requestFallback: (_, { error }) => {
    if (error.name === 'AbortError') {
      return {
        content: 'Request is aborted',
        role: 'assistant',
      };
    }
    return {
      content: 'Request failed, please try again!',
      role: 'assistant',
    };
  },
  transformMessage: (info) => {
    const { originMessage, chunk } = info || {};
    let currentContent = '';
    let currentThink = '';
    try {
      if (chunk?.data && !chunk?.data.includes('DONE')) {
        const message = JSON.parse(chunk?.data);
        currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
        currentContent = message?.choices?.[0]?.delta?.content || '';
      }
    } catch (error) {
      console.error(error);
    }

    let content = '';

    if (!originMessage?.content && currentThink) {
      content = `<think>${currentThink}`;
    } else if (
      originMessage?.content?.includes('<think>') &&
      !originMessage?.content.includes('</think>') &&
      currentContent
    ) {
      content = `${originMessage?.content}</think>${currentContent}`;
    } else {
      content = `${originMessage?.content || ''}${currentThink}${currentContent}`;
    }
    return {
      content: content,
      role: 'assistant',
    };
  },
  resolveAbortController: (controller) => {
    abortController.value = controller;
  },
});

// ==================== Event ====================
const onSubmit = (val: string) => {
  if (!val) return;

  if (loading.value) {
    message.error('Request is in progress, please wait for the request to complete.');
    return;
  }

  onRequest({
    stream: true,
    message: { role: 'user', content: val },
  });
};

// ==================== Nodes ====================
const chatSider = computed(() => (
  <div style={styles.value.sider}>
    {/* 🌟 Logo */}
    <div style={styles.value.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
        width={24}
        height={24}
      />
      <span style={styles.value.logoTitle}>Ant Design X</span>
    </div>

    {/* 🌟 添加会话 */}
    <Button
      onClick={() => {
        if (loading.value) {
          message.error(
            'Message is Requesting, you can create a new conversation after request done or abort it right now...',
          );
          return;
        }

        const now = dayjs().valueOf().toString();
        conversations.value = [
          {
            key: now,
            label: `New Conversation ${conversations.value.length + 1}`,
            group: 'Today',
          },
          ...conversations.value,
        ];
        curConversation.value = now;
        messages.value = [];
      }}
      type="link"
      style={styles.value.addBtn}
      icon={<PlusOutlined />}
    >
      New Conversation
    </Button>

    {/* 🌟 会话管理 */}
    <Conversations
      items={conversations.value}
      style={styles.value.conversations}
      activeKey={curConversation.value}
      onActiveChange={async (val) => {
        abortController.value?.abort();
        // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
        // In future versions, the sessionId capability will be added to resolve this problem.
        setTimeout(() => {
          curConversation.value = val;
          messages.value = messageHistory.value?.[val] || [];
        }, 100);
      }}
      groupable
      styles={{ item: { padding: '0 8px' } }}
      menu={(conversation) => ({
        items: [
          {
            label: 'Rename',
            key: 'rename',
            icon: <EditOutlined />,
          },
          {
            label: 'Delete',
            key: 'delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              const newList = conversations.value.filter((item) => item.key !== conversation.key);
              const newKey = newList?.[0]?.key;
              conversations.value = newList;
              // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
              // This feature will be fixed in a future version.
              setTimeout(() => {
                if (conversation.key === curConversation.value) {
                  curConversation.value = newKey || '';
                  setMessages(messageHistory.value?.[newKey] || []);
                }
              }, 200);
            },
          },
        ],
      })}
    />

    <div style={styles.value.siderFooter}>
      <Avatar size={24} />
      <Button type="text" icon={<QuestionCircleOutlined />} />
    </div>
  </div>
));

const chatList = computed(() => (
  <div style={styles.value.chatList}>
    {messages.value?.length ? (
      /* 🌟 消息列表 */
      <Bubble.List
        items={messages.value?.map((i) => ({
          ...i.message,
          styles: {
            content: i.status === 'loading' ? styles.value.loadingMessage : undefined,
          },
          typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
        }))}
        style={{ height: '100%', paddingInline: 'calc(calc(100% - 700px) /2)' }}
        roles={{
          assistant: {
            placement: 'start',
            footer: (
              <div style={{ display: 'flex' }}>
                <Button type="text" size="small" icon={<ReloadOutlined />} />
                <Button type="text" size="small" icon={<CopyOutlined />} />
                <Button type="text" size="small" icon={<LikeOutlined />} />
                <Button type="text" size="small" icon={<DislikeOutlined />} />
              </div>
            ),
            loadingRender: () => <Spin size="small" />,
          },
          user: { placement: 'end' },
        }}
      />
    ) : (
      <Space
        direction="vertical"
        size={16}
        style={{ paddingInline: 'calc(calc(100% - 700px) /2)', ...styles.value.placeholder }}
      >
        <Welcome
          variant="borderless"
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="Hello, I'm Ant Design X Vue"
          description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
          extra={
            <Space>
              <Button icon={<ShareAltOutlined />} />
              <Button icon={<EllipsisOutlined />} />
            </Space>
          }
        />
        <Flex gap={16}>
          <Prompts
            items={[HOT_TOPICS]}
            styles={{
              list: { height: '100%' },
              item: {
                flex: 1,
                backgroundImage: isDark.value
                  ? 'linear-gradient(123deg, #1e2a38 0%, #2b1f3b 100%)'
                  : 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                borderRadius: '12px',
                border: 'none',
              },
              subItem: { padding: 0, background: 'transparent' },
            }}
            onItemClick={(info) => {
              onSubmit(info.data.description as string);
            }}
          />

          <Prompts
            items={[DESIGN_GUIDE]}
            styles={{
              item: {
                flex: 1,
                backgroundImage: isDark.value
                  ? 'linear-gradient(123deg, #1e2a38 0%, #2b1f3b 100%)'
                  : 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                borderRadius: '12px',
                border: 'none',
              },
              subItem: { background: isDark.value ? undefined :'#ffffffa6' },
            }}
            onItemClick={(info) => {
              onSubmit(info.data.description as string);
            }}
          />
        </Flex>
      </Space>
    )}
  </div>
));
const senderHeader = computed(() => (
  <Sender.Header
    title="Upload File"
    open={attachmentsOpen.value}
    onOpenChange={(open) => attachmentsOpen.value = open}
    styles={{
      content: {
        padding: 0,
      },
    }}
  >
    <Attachments
      beforeUpload={() => false}
      items={attachedFiles.value}
      onChange={(info) => attachedFiles.value = info.fileList}
      placeholder={(type) =>
        type === 'drop'
          ? { title: 'Drop file here' }
          : {
            icon: <CloudUploadOutlined />,
            title: 'Upload files',
            description: 'Click or drag files to this area to upload',
          }
      }
    />
  </Sender.Header>
));
const chatSender = computed(() => (
  <>
    {/* 🌟 提示词 */}
    <Prompts
      items={SENDER_PROMPTS}
      onItemClick={(info) => {
        onSubmit(info.data.description as string);
      }}
      styles={{
        item: { padding: '6px 12px' },
      }}
      style={styles.value.senderPrompt}
    />
    {/* 🌟 输入框 */}
    <Sender
      value={inputValue.value}
      header={senderHeader.value}
      onSubmit={() => {
        onSubmit(inputValue.value);
        inputValue.value = '';
      }}
      onChange={value => inputValue.value = value}
      onCancel={() => {
        abortController.value?.abort();
      }}
      prefix={
        <Button
          type="text"
          icon={<PaperClipOutlined style={{ fontSize: '18px' }} />}
          onClick={() => attachmentsOpen.value = !attachmentsOpen.value}
        />
      }
      loading={loading.value}
      style={styles.value.sender}
      allowSpeech
      actions={(_, info) => {
        const { SendButton, LoadingButton, SpeechButton } = info.components;
        return (
          <Flex gap={4}>
            <SpeechButton style={styles.value.speechButton} />
            {loading.value ? <LoadingButton type="default" /> : <SendButton type="primary" />}
          </Flex>
        );
      }}
      placeholder="Ask or input / use skills"
    />
  </>
));

watch(messages, () => {
  // history mock
  if (messages.value?.length) {
    messageHistory.value = {
      ...messageHistory.value,
      [curConversation.value]: messages.value,
    }
  }
});

defineRender(() => {
  return (
    <div style={styles.value.layout}>
      {chatSider.value}

      <div style={styles.value.chat}>
        {chatList.value}
        {chatSender.value}
      </div>
    </div>
  );
});
</script>
