<script setup lang="tsx">
defineOptions({ name: 'AXConversationsShortcutKeysV2' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Tag, theme, Typography } from 'ant-design-vue';
import { computed, ref } from 'vue';

// KeyboardEvent.keyCode. K is 75, matching @ant-design/x Conversations demos.
const KeyK = 75;

const agentItems: ConversationsProps['items'] = [
  { key: 'write', label: 'Help Me Write', icon: <CodeOutlined /> },
  { key: 'coding', label: 'AI Coding', icon: <CodeOutlined /> },
  { key: 'createImage', label: 'Create Image', icon: <FileImageOutlined /> },
  { key: 'deepSearch', label: 'Deep Search', icon: <FileSearchOutlined /> },
];

const historicalItems = ref<ConversationsProps['items']>([
  { key: 'item1', label: 'Conversation Item 1', group: 'Today' },
]);

const items = computed(() => [...agentItems, ...(historicalItems.value || [])]);

const { token } = theme.useToken();
const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
};

const newChatClick = () => {
  const next = (historicalItems.value?.length || 0) + 1;
  historicalItems.value = [
    ...(historicalItems.value || []),
    {
      key: `item${next}`,
      label: `Conversation Item ${next}`,
      group: 'Today',
    },
  ];
};

defineRender(() => (
  <>
    <Typography.Paragraph>
      Switch sessions with <Tag>Alt/⌥</Tag> + <Tag>number</Tag>, and create a
      chat with <Tag>Win/⌘</Tag> + <Tag>K</Tag>.
    </Typography.Paragraph>
    <Conversations
      creation={{ onClick: newChatClick }}
      items={items.value}
      defaultActiveKey="write"
      style={style}
      groupable
      shortcutKeys={{
        creation: ['Meta', KeyK],
        items: ['Alt', 'number'],
      }}
    />
  </>
));
</script>
