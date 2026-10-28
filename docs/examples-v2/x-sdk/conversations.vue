<script setup lang="tsx">
defineOptions({ name: 'AXSdkConversationsV2' });

import { Button, Flex } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import { useMockChat } from '../_shared/use-mock-chat';

const chat = useMockChat();

defineRender(() => (
  <Flex vertical gap={12}>
    <Button type="primary" onClick={() => chat.addChat()}>New chat</Button>
    <Conversations
      items={chat.conversations.value}
      activeKey={chat.activeConversationKey.value}
      onActiveChange={(key: string) => chat.setActiveConversationKey(key)}
    />
  </Flex>
));
</script>
