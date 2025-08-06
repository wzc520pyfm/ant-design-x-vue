<script setup lang="ts">
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
  AppstoreOutlined,
  ReloadOutlined,
  ScheduleOutlined,
} from '@ant-design/icons-vue';
import {
  Attachments,
  type Attachment,
  Bubble,
  Conversations,
  type Conversation,
  Prompts,
  Sender,
  Suggestion,
  Welcome,
  useXAgent,
  useXChat,
  theme,
} from 'ant-design-x-vue';
import { Button, Image, Popover, Space, Spin, message } from 'ant-design-vue';
import { ref, watch, onMounted, computed, h } from 'vue';

defineOptions({ name: 'PlaygroundCopilotSetup' });

type BubbleDataType = {
  role: string;
  content: string;
};

const MOCK_SESSION_LIST = [
  {
    key: '5',
    label: 'New session',
    group: 'Today',
  },
  {
    key: '4',
    label: 'What has Ant Design X upgraded?',
    group: 'Today',
  },
  {
    key: '3',
    label: 'New AGI Hybrid Interface',
    group: 'Today',
  },
  {
    key: '2',
    label: 'How to quickly install and import components?',
    group: 'Yesterday',
  },
  {
    key: '1',
    label: 'What is Ant Design X?',
    group: 'Yesterday',
  },
];
const MOCK_SUGGESTIONS = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
];
const MOCK_QUESTIONS = [
  'What has Ant Design X upgraded?',
  'What components are in Ant Design X?',
  'How to quickly install and import components?',
];
const AGENT_PLACEHOLDER = 'Generating content, please wait...';


const attachmentsRef = ref<InstanceType<typeof Attachments>>(null);
const abortController = ref<AbortController>(null);

// ==================== State ====================

const messageHistory = ref<Record<string, any>>({});

const sessionList = ref<Conversation[]>(MOCK_SESSION_LIST);
const curSession = ref(sessionList.value[0].key);

const attachmentsOpen = ref(false);
const files = ref<Attachment[]>([]);

const inputValue = ref('');


// ==================== Runtime ====================

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const [agent] = useXAgent<BubbleDataType>({
  baseURL: 'https://api.x.ant.design/api/model-url-path',
  model: 'model-name',
  dangerouslyApiKey: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
});

const loading = agent.value.isRequesting();

const { messages, onRequest, setMessages } = useXChat({
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
    const { originMessage, currentMessage } = info || {};
    let currentContent = '';
    let currentThink = '';
    try {
      if (currentMessage?.data && !currentMessage?.data.includes('DONE')) {
        const message = JSON.parse(currentMessage?.data);
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
watch(curSession, () => {
  if (curSession.value !== undefined) {
    setMessages(messageHistory.value?.[curSession.value] || []);
  } else {
    setMessages([]);
  }
}, { immediate: true });

watch(
  () => messages.value,
  () => {
    // history mock
    if (messages.value?.length) {
      messageHistory.value = {
        ...messageHistory.value,
        [curSession.value]: messages.value,
      }
    }
  }
);


// ==================== Event ====================
const handleUserSubmit = (val: string) => {
  onRequest({
    stream: true,
    message: { content: val, role: 'user' },
  });

  // session title mock
  if (sessionList.value.find((i) => i.key === curSession.value)?.label === 'New session') {
    const tempList = sessionList.value.map((i) => (i.key !== curSession.value ? i : { ...i, label: val?.slice(0, 20) }));
    sessionList.value = tempList
  }
};

const onPasteFile = (_: File, files: FileList) => {
  for (const file of Array.from(files)) {
    attachmentsRef.value?.upload(file);
  }
  attachmentsOpen.value = true;
};

const createNewSession = () => {
  if (agent.value.isRequesting()) {
    message.error(
      'Message is Requesting, you can create a new conversation after request done or abort it right now...',
    );
    return;
  }

  if (messages.value?.length) {
    const timeNow = new Date().getTime().toString();
    try {
      abortController.value?.abort();
    } catch (error) {
      console.error(error);
    }
    // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
    // In future versions, the sessionId capability will be added to resolve this problem.
    setTimeout(() => {
      sessionList.value = [
        { key: timeNow, label: 'New session', group: 'Today' },
        ...sessionList.value,
      ]
      curSession.value = timeNow;
    }, 100);
  } else {
    message.error('It is now a new conversation.');
  }
}

const changeConversation = async (val: string) => {
  try {
    abortController.value?.abort();
  } catch (error) {
    console.error(error); 
  }
  // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
  // In future versions, the sessionId capability will be added to resolve this problem.
  setTimeout(() => {
    curSession.value = val;
  }, 100);
}

const setCopilotOpen = (val: boolean) => copilotOpen.value = val;


// ==================== Style ====================
const { token } = theme.useToken();
const styles = computed(() => {
  return {
    copilotChat: {
      width: '400px',
      display: 'flex',
      flexDirection: 'column',
      background: token.value.colorBgContainer,
      color: token.value.colorText,
    },
    // chatHeader 样式
    chatHeader: {
      height: '52px',
      boxSizing: 'border-box',
      borderBottom: `1px solid ${token.value.colorBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px 0 16px',
    },
    headerTitle: {
      'font-weight': 600,
      'font-size': '15px',
    },
    headerButton: {
      width: '32px',
      height: '32px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'font-size': '18px',
    },
    conversations: {
      width: '300px',
      '& .ant-conversations-list': {
        paddingInlineStart: 0,
      },
    },
    // chatList 样式
    chatList: {
      overflow: 'auto',
      'padding-block': '16px',
      flex: 1,
    },
    chatWelcome: {
      'margin-inline': '16px',
      padding: '12px 16px',
      'border-radius': '2px 12px 12px 12px',
      'background': token.value.colorBgTextHover,
      'margin-bottom': '16px',
    },
    loadingMessage: {
      'background-image': 'linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%)',
      'background-size': '100% 2px',
      'background-repeat': 'no-repeat',
      'background-position': 'bottom',
    },
    // chatSend 样式
    chatSend: {
      padding: '12px'
    },
    sendAction: {
      display: 'flex',
      'align-items': 'center',
      'margin-bottom': '12px',
      gap: '8px',
    },
    speechButton: {
      'font-size': '18px',
      color: `${token.value.colorText} !important`,
    },
  } as const;
});
const workareaStyles = computed(() => {
  return {
    copilotWrapper: {
      'min-width': '970px',
      height: '100vh',
      display: 'flex',
    },
    workarea: {
      flex: 1,
      background: token.value.colorBgLayout,
      display: 'flex',
      flexDirection: 'column',
    },
    workareaHeader: {
      'box-sizing': 'border-box',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      'justify-content': 'space-between',
      padding: '0 48px 0 28px',
      'border-bottom': `1px solid ${token.value.colorBorder}`,
    },
    headerTitle: {
      'font-weight': 600,
      'font-size': '15px',
      'color': token.value.colorText,
      'display': 'flex',
      'align-items': 'center',
      'gap': '8px',
    },
    headerButton: {
      'background-image': 'linear-gradient(78deg, #8054f2 7%, #3895da 95%)',
      'border-radius': '12px',
      height: '24px',
      width: '93px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      color: '#fff',
      cursor: 'pointer',
      'font-size': '12px',
      'font-weight': 600,
      transition: 'all 0.3s',
      '&:hover': {
        'opacity': 0.8,
      },
    },
    workareaBody: {
      flex: 1,
      padding: '16px',
      background: token.value.colorBgContainer,
      borderRadius: '16px',
      minHeight: 0,
    },
    bodyContent: {
      overflow: 'auto',
      height: '100%',
      'padding-right': '10px',
    },
    bodyText: {
      color: token.value.colorText,
      padding: '8px'
    },
  } as const;
});

// ==================== State =================
const copilotOpen = ref<boolean>(true)

const roles: (typeof Bubble.List)['roles'] = {
  assistant: {
    placement: 'start',
    footer: h('div', {style:{ display: 'flex' }}, [
      h('Button', {type: 'text', size: 'small', icon: h(ReloadOutlined), onClick: () => {}}),
      h('Button', {type: 'text', size: 'small', icon: h(CopyOutlined), onClick: () => {}}),
      h('Button', {type: 'text', size:'small', icon: h(LikeOutlined), onClick: () => {}}),
      h('Button', {type: 'text', size:'small', icon: h(DislikeOutlined), onClick: () => {}}),
    ]),
    loadingRender: () => h(
      Space,
      {},
      [
        h(Spin, {size: 'small'}, []),
        AGENT_PLACEHOLDER,
      ]
    )
  },
  user: { placement: 'end' },
}
</script>

<template>
  <div :style="workareaStyles.copilotWrapper">
    <!-- 左侧工作区 -->
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
          ✨ AI Copilot
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
    <!-- 右侧对话区 -->
    <div :style="{ ...styles.copilotChat, display: copilotOpen ? 'flex' : 'none' }">
      <!-- 对话区 - header -->
      <!-- {chatHeader} -->
      <div :style="styles.chatHeader">
        <div :style="styles.headerTitle">
          ✨ AI Copilot
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
            :overlay-style="{ padding: 0, maxHeight: 600 }"
          >
            <template #content>
              <Conversations
                :items="sessionList?.map((i) =>
                  i.key === curSession ? { ...i, label: `[current] ${i.label}` } : i,
                )"
                :active-key="curSession"
                groupable
                :styles="{...styles.conversations, item: { padding: '0 8px' } }"
                @active-change="changeConversation"
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
      <!-- 对话区 - 消息列表 -->
      <div :style="styles.chatList">
        <Bubble.List
          v-if="messages?.length"
          :style="{ height: '100%', paddingInline: '16px' }"
          :items="messages?.map((i) => ({
            ...i.message,
            styles: {
              content: i.status === 'loading' ? styles.loadingMessage : {},
            },
            loading: i.status === 'loading',
            typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: h('span', '💗') } : false,
          }))"
          :roles="roles"
        />
        <template v-else>
          <Welcome
            variant="borderless"
            title="👋 Hello, I'm Ant Design X"
            description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
            :style="styles.chatWelcome"
          />
          <Prompts
            vertical
            title="I can help："
            :items="MOCK_QUESTIONS.map((i) => ({ key: i, description: i }))"
            :style="{
              'margin-inline': '16px',
            }"
            :styles="{
              title: { fontSize: 14 },
            }"
            @item-click="(info) => handleUserSubmit(info?.data?.description as string)"
          />
        </template>
      </div>

      <!-- 对话区 - 输入框 -->
      <!-- {chatSender} -->
      <div :style="styles.chatSend">
        <div :style="styles.sendAction">
          <Button
            :icon="h(ScheduleOutlined)"
            @click="handleUserSubmit('What has Ant Design X upgraded?')"
          >
            Upgrades
          </Button>
          <Button
            :icon="h(AppstoreOutlined)"
            @click="handleUserSubmit('What component assets are available in Ant Design X?')"
          >
            Components
          </Button>
          <Button :icon="h(AppstoreAddOutlined)">
            More
          </Button>
        </div>
        <!-- 输入框 -->
      
        <Suggestion
          :items="MOCK_SUGGESTIONS"
          @select="(itemVal) => inputValue = `[${itemVal}]:`"
        >
          <template #default="{ onTrigger, onKeyDown }">
            <Sender
              :loading="loading"
              :value="inputValue"
              allow-speech
              placeholder="Ask or input / use skills"
              @change="(v) => {
                onTrigger(v === '/');
                inputValue = v;
              }"
              @submit="() => {
                handleUserSubmit(inputValue);
                inputValue = '';
              }"
              @cancel="() => {
                try {
                  abortController?.abort();
                } catch (error) {
                  console.error(error); 
                }
              }"
              @key-down="onKeyDown"
              @paste-file="onPasteFile"
            >
              <template #header>
                <Sender.Header
                  title="Upload File"
                  :styles="{ content: { padding: 0 } }"
                  :open="attachmentsOpen"
                  force-render
                  @open-change="val => attachmentsOpen = val"
                >
                  <Attachments
                    ref="attachmentsRef"
                    :before-upload="() => false"
                    :items="files"
                    :placeholder="(type) =>
                      type === 'drop'
                        ? { title: 'Drop file here' }
                        : {
                          icon: h(CloudUploadOutlined),
                          title: 'Upload files',
                          description: 'Click or drag files to this area to upload',
                        }"
                    @change="({ fileList }) => files = fileList"
                  />
                </Sender.Header>
              </template>
              <template #prefix>
                <Button
                  type="text"
                  :icon="h(PaperClipOutlined, {style: { fontSize: '18px' }})"
                  @click="attachmentsOpen = !attachmentsOpen"
                />
              </template>
              <template #actions="{info: {components: {SendButton, LoadingButton, SpeechButton}}}">
                <div :style="{ display: 'flex', alignItems: 'center', gap: 4 }">
                  <component
                    :is="SpeechButton"
                    :style="styles.speechButton"
                  />
                  <component
                    :is="LoadingButton"
                    v-if="loading"
                    type="default"
                  />
                  <component
                    :is="SendButton"
                    v-else
                    type="primary"
                  />
                </div>
              </template>
            </Sender>
          </template>
        </Suggestion>
      </div>
    </div>
  </div>
</template>