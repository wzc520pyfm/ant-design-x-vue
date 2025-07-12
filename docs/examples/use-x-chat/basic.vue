<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { Flex } from 'ant-design-vue';
import { Bubble, Sender, useXAgent, useXChat, type BubbleListProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXUseXChatBasic' });

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
    },
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const mockSuccess = ref(false);
const content = ref('');
const senderLoading = ref(false);

const setContent = (v: string) => {
  content.value = v;
}

// Agent for request
const [agent] = useXAgent<string, { message: string }, string>({
  request: async ({ message }, { onSuccess, onError }) => {
    senderLoading.value = true;
    await sleep();
    senderLoading.value = false;
    mockSuccess.value = !mockSuccess.value;

    if (mockSuccess.value) {
      onSuccess([`Mock success return. You said: ${message}`]);
    }

    onError(new Error('Mock request failed'));
  },
});

// Chat messages
const { onRequest, messages } = useXChat({
  agent: agent.value,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
});

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ maxHeight: '300px' }}
        items={messages.value.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          role: status === 'local' ? 'local' : 'ai',
          content: message,
        }))}
      />
      <Sender
        loading={senderLoading.value}
        value={content.value}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          setContent('');
        }}
      />
    </Flex>
  )
});
</script>
