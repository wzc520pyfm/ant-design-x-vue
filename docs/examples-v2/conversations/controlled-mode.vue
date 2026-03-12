<script setup lang="tsx">
defineOptions({ name: 'AXConversationsControlledModeV2' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Button, Flex, theme } from 'ant-design-vue';
import { ref } from 'vue';

const items: ConversationsProps['items'] = [
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
];

const activeKey = ref('write');
const { token } = theme.useToken();

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
};

defineRender(() => (
  <Flex vertical gap="small" align="flex-start">
    <Conversations
      activeKey={activeKey.value}
      onActiveChange={(v) => {
        activeKey.value = v;
      }}
      items={items}
      style={style}
    />
    <Flex gap="small">
      <Button onClick={() => { activeKey.value = 'write'; }}>Active First</Button>
      <Button onClick={() => { activeKey.value = 'deepSearch'; }}>Active Last</Button>
    </Flex>
  </Flex>
));
</script>
