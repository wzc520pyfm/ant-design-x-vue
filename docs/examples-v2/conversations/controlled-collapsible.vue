<script setup lang="tsx">
defineOptions({ name: 'AXConversationsControlledCollapsibleV2' });

import { FieldTimeOutlined } from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Flex, theme } from 'ant-design-vue';
import { ref } from 'vue';

const groupName = ['Today', 'Yesterday', 'Historical chats'];
const items: ConversationsProps['items'] = Array.from({ length: 9 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  group: groupName[index % 3],
}));

const expandedKeys = ref(['Yesterday']);
const { token } = theme.useToken();

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
};

defineRender(() => {
  const groupable: ConversationsProps['groupable'] = {
    label: (group) => (
      <Flex gap="small">
        <FieldTimeOutlined />
        {group}
      </Flex>
    ),
    collapsible: (group) => group !== 'Today',
    expandedKeys: expandedKeys.value,
    onExpand: (keys) => { expandedKeys.value = keys; },
  };

  return (
    <Conversations items={items} defaultActiveKey="item1" style={style} groupable={groupable} />
  );
});
</script>
