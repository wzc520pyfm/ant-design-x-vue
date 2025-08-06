<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { Flex } from 'ant-design-vue';
import { Bubble, Sender, useXAgent, useXChat } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXUseXChatStream' });

const roles: (typeof Bubble.List)['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const content = ref('');
const senderLoading = ref(false);

// Agent for request
const [ agent ] = useXAgent<string, { message: string }, string>({
  request: async ({ message }, { onSuccess, onUpdate }) => {
    senderLoading.value = true;
    const fullContent = `Streaming output instead of Bubble typing effect. You typed: ${message}`;
    let currentContent = '';

    const id = setInterval(() => {
      currentContent = fullContent.slice(0, currentContent.length + 2);
      onUpdate(currentContent);
      if (currentContent === fullContent) {
        senderLoading.value = false;
        clearInterval(id);
        onSuccess([fullContent]);
      }
    }, 100);
  },
});

// Chat messages
const { onRequest, messages } = useXChat({
  agent: agent.value,
});

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ maxHeight: 300 }}
        items={messages.value.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
        }))}
      />
      <Sender
        loading={senderLoading.value}
        value={content.value}
        onChange={(v) => content.value = v}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          content.value = '';
        }}
      />
    </Flex>
  )
});
</script>
