<script setup lang="tsx">
defineOptions({ name: 'AXConversationsNewChatV2' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';
import { ref, computed } from 'vue';

const agentItems: ConversationsProps['items'] = [
  {
    key: 'write',
    label: 'Help Me Write',
    icon: <CodeOutlined />,
  },
  {
    key: 'coding',
    label: 'AI Coding',
    icon: <CodeOutlined />,
  },
  {
    key: 'createImage',
    label: 'Create Image',
    icon: <FileImageOutlined />,
  },
  {
    key: 'deepSearch',
    label: 'Deep Search',
    icon: <FileSearchOutlined />,
  },
  {
    type: 'divider',
  },
];

const historicalItems = ref<ConversationsProps['items']>([
  {
    key: 'item1',
    label: 'Conversation Item 1',
    group: 'Today',
  },
]);

const items = computed(() => [...agentItems!, ...historicalItems.value!]);

const { token } = theme.useToken();

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
};

const newChatClick = () => {
  historicalItems.value = [
    ...historicalItems.value!,
    {
      key: `item${historicalItems.value!.length + 1}`,
      label: `Conversation Item ${historicalItems.value!.length + 1}`,
      group: 'Today',
    },
  ];
};

defineRender(() => (
  <Conversations
    creation={{ onClick: newChatClick }}
    items={items.value}
    defaultActiveKey="write"
    style={style}
    groupable
  />
));
</script>
