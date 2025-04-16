<script setup lang="ts">
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  type BubbleListProps,
  Conversations,
  type ConversationsProps,
  Prompts,
  type PromptsProps,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from 'ant-design-x-vue';
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { Badge, Button, Space, theme } from 'ant-design-vue';
import { computed, ref, watch, h, type VNode } from 'vue';

defineOptions({ name: 'PlaygroundIndependentSetup' });

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const renderTitle = (icon: VNode, title: string) => {
  return h( Space, { align: 'start' }, [icon, h('span', {}, title)])
}

const defaultConversationsItems = [
  {
    key: '0',
    label: 'What is Ant Design X?',
  },
];

const placeholderPromptsItems: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(h(FireOutlined, { style:{ color: '#FF4D4F' } }), 'Hot Topics'),
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `What's new in X?`,
      },
      {
        key: '1-2',
        description: `What's AGI?`,
      },
      {
        key: '1-3',
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(h(ReadOutlined, { style: { color: '#1890FF' } }), 'Design Guide'),
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: h(HeartOutlined),
        description: `Know the well`,
      },
      {
        key: '2-2',
        icon: h(SmileOutlined),
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        icon: h(CommentOutlined),
        description: `Express the feeling`,
      },
    ],
  },
];

const senderPromptsItems: PromptsProps['items'] = [
  {
    key: '1',
    description: 'Hot Topics',
    icon: h(FireOutlined, { style: { color: '#FF4D4F' } }),
  },
  {
    key: '2',
    description: 'Design Guide',
    icon: h(ReadOutlined, { style: { color: '#1890FF' } }),
  },
];

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: '16px',
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
};

// ==================== Style ====================
const { token } = theme.useToken();
const styles = computed(() => {
  return {
    layout: {
      width: '100%',
      'min-width': '1000px',
      height: '722px',
      'border-radius': `${token.value.borderRadius}px`,
      display: 'flex',
      background: `${token.value.colorBgContainer}`,
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    menu: {
      background: `${token.value.colorBgLayout}80`,
      width: '280px',
      height: '100%',
      display: 'flex',
      'flex-direction': 'column',
    },
    conversations: {
      padding: '0 12px',
      flex: 1,
      'overflow-y': 'auto',
    },
    chat: {
      height: '100%',
      width: '100%',
      'max-width': '700px',
      margin: '0 auto',
      'box-sizing': 'border-box',
      display: 'flex',
      'flex-direction': 'column',
      padding: `${token.value.paddingLG}px`,
      gap: '16px',
    },
    messages: {
      flex: 1,
    },
    placeholder: {
      'padding-top': '32px',
    },
    sender: {
      'box-shadow': token.value.boxShadow,
    },
    logo: {
      display: 'flex',
      height: '72px',
      'align-items': 'center',
      'justify-content': 'start',
      padding: '0 24px',
      'box-sizing': 'border-box',
    },
    'logo-img': {
      width: '24px',
      height: '24px',
      display: 'inline-block',
    },
    'logo-span': {
      display: 'inline-block',
      margin: '0 8px',
      'font-weight': 'bold',
      color: token.value.colorText,
      'font-size': '16px',
    },
    addBtn: {
      background: '#1677ff0f',
      border: '1px solid #1677ff34',
      width: 'calc(100% - 24px)',
      margin: '0 12px 24px 12px',
    }
  } as const
});

// ==================== State ====================
const headerOpen = ref(false);
const content = ref('');
const conversationsItems = ref(defaultConversationsItems);
const activeKey = ref(defaultConversationsItems[0].key);
const attachedFiles = ref<AttachmentsProps['items']>([]);
const agentRequestLoading = ref(false);

// ==================== Runtime ====================
const [ agent ] = useXAgent({
  request: async ({ message }, { onSuccess }) => {
    agentRequestLoading.value = true;
    await sleep();
    agentRequestLoading.value = false;
    onSuccess(`Mock success return. You said: ${message}`);
  },
});

const { onRequest, messages, setMessages } = useXChat({
  agent: agent.value,
});

watch(activeKey, () => {
  if (activeKey.value !== undefined) {
    setMessages([]);
  }
}, { immediate: true });

// ==================== Event ====================
const onSubmit = (nextContent: string) => {
  if (!nextContent) return;
  onRequest(nextContent);
  content.value = '';
};

const onPromptsItemClick: PromptsProps['onItemClick'] = (info) => {
  onRequest(info.data.description as string);
};

const onAddConversation = () => {
  conversationsItems.value = [
    ...conversationsItems.value,
    {
      key: `${conversationsItems.value.length}`,
      label: `New Conversation ${conversationsItems.value.length}`,
    },
  ];
  activeKey.value = `${conversationsItems.value.length}`;
};

const onConversationClick: ConversationsProps['onActiveChange'] = (key) => {
  activeKey.value = key;
};

const handleFileChange: AttachmentsProps['onChange'] = (info) =>
  attachedFiles.value = info.fileList;

// ==================== Nodes ====================
const placeholderNode = computed(() => h(
  Space,
  { direction: "vertical", size: 16, style: styles.value.placeholder },
  [
    h(
      Welcome,
      {
        variant: "borderless",
        icon: "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",
        title: "Hello, I'm Ant Design X",
        description: "Base on Ant Design, AGI product interface solution, create a better intelligent vision~",
        extra: h(Space, {}, [h(Button, { icon: h(ShareAltOutlined) }), h(Button, { icon: h(EllipsisOutlined) })]),
      }
    ),
    h(
      Prompts,
      {
        title: "Do you want?",
        items: placeholderPromptsItems,
        styles: {
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        },
        onItemClick: onPromptsItemClick,
      }
    )
  ]
));

const items = computed<BubbleListProps['items']>(() => {
  if (messages.value.length === 0) {
    return [{ content: placeholderNode, variant: 'borderless' }];
  }
  return messages.value.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }))
});

</script>
<template>
  <div :style="styles.layout">
    <div :style="styles.menu">
      <!-- 🌟 Logo -->
      <div :style="styles.logo">
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          :draggable="false"
          alt="logo"
          :style="styles['logo-img']"
        />
        <span :style="styles['logo-span']">Ant Design X Vue</span>
      </div>
      <!-- 🌟 添加会话 -->
      <Button
        :icon="h(PlusOutlined)"
        type="link"
        :style="styles.addBtn"
        @click="onAddConversation"
      >
        New Conversation
      </Button>
      <!-- 🌟 会话管理 -->
      <Conversations
        :items="conversationsItems"
        :style="styles.conversations"
        :active-key="activeKey"
        :on-active-change="onConversationClick"
      />
    </div>
    <div :style="styles.chat">
      <!-- 🌟 消息列表 -->
      <Bubble.List
        :items="items"
        :roles="roles"
        :style="styles.messages"
      />
      <!-- 🌟 提示词 -->
      <Prompts
        :style="{ color: token.colorText }"
        :items="senderPromptsItems"
        :on-item-click="onPromptsItemClick"
      />
      <!-- 🌟 输入框 -->
      <Sender
        :value="content"
        :on-submit="onSubmit"
        :on-change="(value) => content = value"
        :loading="agentRequestLoading"
        :style="styles.sender"
      >
        <template #header>
          <Sender.Header
            title="Attachments"
            :open="headerOpen"
            :on-open-change="(open) => headerOpen = open"
            :styles="{
              content: {
                padding: 0,
              },
            }"
          >
            <Attachments
              :before-upload="() => false"
              :items="attachedFiles"
              :on-change="handleFileChange"
              :placeholder="(type) =>
                type === 'drop'
                  ? { title: 'Drop file here' }
                  : {
                    icon: h(CloudUploadOutlined),
                    title: 'Upload files',
                    description: 'Click or drag files to this area to upload',
                  }
              "
            />
          </Sender.Header>
        </template>
        <template #prefix>
          <Badge :dot="attachedFiles.length > 0 && !headerOpen">
            <Button
              type="text"
              :icon="h(PaperClipOutlined)"
              @click="() => headerOpen = !headerOpen"
            />
          </Badge>
        </template>
      </Sender>
    </div>
  </div>
</template>
