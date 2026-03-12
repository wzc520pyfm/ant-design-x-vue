<script setup lang="tsx">
defineOptions({ name: 'AXConversationsGroupV2' });

import type { ConversationsProps } from 'ant-design-x-vue';
import { Conversations } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';

const items: ConversationsProps['items'] = Array.from({ length: 6 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index === 0
      ? "This's Conversation Item 1, you can click me!"
      : `Conversation Item ${index + 1}`,
  group: index < 3 ? 'Today' : 'Yesterday',
}));

const { token } = theme.useToken();

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
};

defineRender(() => (
  <Conversations items={items} defaultActiveKey="item1" style={style} groupable />
));
</script>
