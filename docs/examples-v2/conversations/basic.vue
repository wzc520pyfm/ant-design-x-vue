<script setup lang="tsx">
defineOptions({ name: 'AXConversationsBasicV2' });

import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
} from '@ant-design/icons-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { Flex, Switch, theme } from 'ant-design-vue';
import { ref } from 'vue';

const { token } = theme.useToken();
const deepSearchChecked = ref(false);

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
};

const items = ref<ConversationsProps['items']>([
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
    disabled: !deepSearchChecked.value,
    label: (
      <Flex gap="small" align="center">
        Deep Search
        <Switch
          size="small"
          checked={deepSearchChecked.value}
          onChange={(val: boolean) => (deepSearchChecked.value = val)}
        />
      </Flex>
    ),
    icon: <FileSearchOutlined />,
  },
]);

defineRender(() => (
  <Conversations items={items.value} defaultActiveKey="write" style={style} />
));
</script>
