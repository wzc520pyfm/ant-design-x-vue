<script setup lang="tsx">
defineOptions({ name: 'AXSdkXConversationsOperationsV2' });

import { computed, ref } from 'vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations, useXConversations } from 'ant-design-x-vue';
import { Button, Flex, Typography, theme } from 'ant-design-vue';

const { Paragraph } = Typography;

const createItems = (): NonNullable<ConversationsProps['items']> =>
  Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label:
      index + 1 === 3
        ? "This's Conversation Item 3, you can click me!"
        : `Conversation Item ${index + 1}`,
    disabled: index === 3,
  }));

const idx = ref(5);
const {
  conversations,
  addConversation,
  activeConversationKey,
  setActiveConversationKey,
  setConversation,
  removeConversation,
  getConversation,
  setConversations,
} = useXConversations({
  defaultConversations: createItems(),
  defaultActiveConversationKey: 'item1',
});

const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const onAdd = () => {
  addConversation({ key: `item${idx.value}`, label: `Conversation Item ${idx.value}` });
  idx.value += 1;
};

const onUpdate = () => {
  setConversation(activeConversationKey.value!, {
    key: activeConversationKey.value!,
    label: 'Updated Conversation Item',
  });
};

const onReset = () => {
  setConversations(createItems());
  setActiveConversationKey('item1');
};

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [
    {
      label: 'Delete',
      key: 'delete',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ],
  onClick: () => {
    removeConversation(conversation.key);
  },
});

defineRender(() => (
  <Flex vertical gap="small" align="flex-start">
    <Conversations
      creation={{ onClick: onAdd }}
      items={conversations.value as ConversationsProps['items']}
      activeKey={activeConversationKey.value}
      style={style.value}
      onActiveChange={setActiveConversationKey}
      menu={menuConfig}
    />
    <Flex gap="small">
      <Button onClick={onAdd}>Add</Button>
      <Button onClick={onUpdate}>Update</Button>
      <Button onClick={onReset}>Reset</Button>
    </Flex>
    <Paragraph>
      Current Conversation Data:
      <pre>{JSON.stringify(getConversation(activeConversationKey.value!), null, 2)}</pre>
    </Paragraph>
  </Flex>
));
</script>
