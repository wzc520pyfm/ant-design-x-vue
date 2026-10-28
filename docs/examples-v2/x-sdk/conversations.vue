<script setup lang="tsx">
defineOptions({ name: 'AXSdkConversationsV2' });

import { computed } from 'vue';
import { Button, Flex, theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import { useMockChat } from '../_shared/use-mock-chat';

const chat = useMockChat();
const { token } = theme.useToken();
const listStyle = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

defineRender(() => (
  <Flex vertical gap="small" align="flex-start" style={{ width: '256px' }}>
    <Button type="primary" style={{ alignSelf: 'flex-start', width: 'fit-content' }} onClick={() => chat.addChat()}>New chat</Button>
    <Conversations
      style={listStyle.value}
      items={chat.conversations.value}
      activeKey={chat.activeConversationKey.value}
      onActiveChange={(key: string) => chat.setActiveConversationKey(key)}
    />
  </Flex>
));
</script>
