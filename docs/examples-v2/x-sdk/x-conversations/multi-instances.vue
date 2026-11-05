<script setup lang="tsx">
defineOptions({ name: 'AXSdkXConversationsMultiInstancesV2' });

import { computed, ref } from 'vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations, useXConversations } from 'ant-design-x-vue';
import { Button, Col, Flex, Row, theme } from 'ant-design-vue';

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const others: ConversationsProps['items'] = Array.from({ length: 2 }).map((_, index) => ({
  key: `other${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const idx = ref(5);
const otherIdx = ref(3);

const handler = useXConversations({
  defaultConversations: items as any,
  defaultActiveConversationKey: items![0].key,
});
const otherHandler = useXConversations({
  defaultConversations: others as any,
  defaultActiveConversationKey: others![0].key,
});

const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const onAdd = (type?: string) => {
  const instance = type === 'other' ? otherHandler : handler;
  const n = type === 'other' ? otherIdx.value : idx.value;
  instance.addConversation({
    key: `${type === 'other' ? 'other' : 'item'}${n}`,
    label: `Conversation Item ${n}`,
  });
  if (type === 'other') otherIdx.value += 1;
  else idx.value += 1;
};

const onUpdate = (type?: string) => {
  const instance = type === 'other' ? otherHandler : handler;
  const realActive =
    type === 'other' ? otherHandler.activeConversationKey.value! : handler.activeConversationKey.value!;
  instance.setConversation(realActive, { key: realActive, label: 'Updated Conversation Item' });
};

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [{ label: 'Delete', key: 'delete', icon: <DeleteOutlined />, danger: true }],
  onClick: () => handler.removeConversation(conversation.key),
});

const otherMenuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [{ label: 'Delete', key: 'delete', icon: <DeleteOutlined />, danger: true }],
  onClick: () => otherHandler.removeConversation(conversation.key),
});

defineRender(() => (
  <Flex vertical gap="small" align="flex-start">
    <Row gutter={36}>
      <Col>
        <h3>List 1</h3>
        <Conversations
          items={handler.conversations.value as ConversationsProps['items']}
          activeKey={handler.activeConversationKey.value}
          style={style.value}
          onActiveChange={handler.setActiveConversationKey}
          menu={menuConfig}
        />
        <Flex gap="small" style={{ marginTop: 8 }}>
          <Button onClick={() => onAdd()}>Add</Button>
          <Button onClick={() => onUpdate()}>Update</Button>
        </Flex>
      </Col>
      <Col>
        <h3>List 2</h3>
        <Conversations
          items={otherHandler.conversations.value as ConversationsProps['items']}
          activeKey={otherHandler.activeConversationKey.value}
          style={style.value}
          onActiveChange={otherHandler.setActiveConversationKey}
          menu={otherMenuConfig}
        />
        <Flex gap="small" style={{ marginTop: 8 }}>
          <Button onClick={() => onAdd('other')}>Add</Button>
          <Button onClick={() => onUpdate('other')}>Update</Button>
        </Flex>
      </Col>
    </Row>
  </Flex>
));
</script>
