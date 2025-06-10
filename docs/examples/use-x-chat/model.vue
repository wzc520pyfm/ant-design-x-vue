<script lang="tsx" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { Flex } from 'ant-design-vue';
import { Bubble, Sender, useXAgent, useXChat } from 'ant-design-x-vue';
import { ref, watch } from 'vue';

defineOptions({ name: 'AXUseXChatModel' });

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_deepseekr1';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'deepseek-ai/DeepSeek-R1';

/**
 * 🔔 the API_KEY is a placeholder indicator interface that has a built-in real API_KEY
 */

const API_KEY = 'Bearer sk-xxxxxxxxxxxxxxxxxxxx';

type YourMessageType = {
  role: string;
  content: string;
};

const roles: (typeof Bubble.List)['roles'] = {
  assistant: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const content = ref('');
const [agent] = useXAgent<YourMessageType>({
  baseURL: BASE_URL,
  model: MODEL,
  dangerouslyApiKey: API_KEY,
  /** 🔥🔥 Its dangerously! */
});
const abortController = ref<AbortController>(null);
// Chat messages
const { onRequest, messages } = useXChat({
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
  requestPlaceholder: () => {
    return {
      content: 'Please wait...',
      role: 'assistant',
    };
  },
  transformMessage: (info) => {
    const { originMessage, currentMessage, status } = info || {};
    let currentText = '';
    let originText = '';
    if (status === 'loading' && currentMessage.data && !currentMessage.data.includes('DONE')) {
      const message = JSON.parse(currentMessage.data);
      currentText =
        message?.choices?.[0].delta?.reasoning_content === null
          ? ''
          : message?.choices?.[0].delta?.reasoning_content;
    }
    if (originMessage) {
      originText = originMessage.content || '';
    }
    return {
      content: originText + currentText,
      role: 'assistant',
    };
  },
  resolveAbortController: (controller) => {
    abortController.value = controller;
  },
});

const senderLoading = ref(false);

watch(() => agent.value.isRequesting(), () => {
  senderLoading.value = agent.value.isRequesting();
});

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ maxHeight: 300 }}
        items={messages.value.map(({ id, message }) => ({
          key: id,
          role: message.role,
          content: message.content,
        }))}
      />
      <Sender
        loading={senderLoading.value}
        value={content.value}
        onCancel={() => {
          abortController?.value?.abort?.();
        }}
        onChange={(v) => {
          content.value = v;
        }}
        onSubmit={(nextContent) => {
          onRequest({
            stream: true,
            message: {
              role: 'user',
              content: nextContent,
            },
          });
          content.value = '';
        }}
      />
    </Flex>
  );
});
</script>
