<script setup lang="tsx">
import { CommentOutlined } from '@ant-design/icons-vue';
import { Space, theme } from 'ant-design-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { computed } from 'vue';


defineOptions({ name: 'AXConversationsGroupSort' });

const items: ConversationsProps['items'] = Array.from({ length: 6 }).map((_, index) => {
  const timestamp = index <= 3 ? 1732204800000 : 1732204800000 - 60 * 60 * 24;

  return {
    key: `item${index + 1}`,
    label: `Conversation ${timestamp + index * 60 * 60}`,
    timestamp: timestamp + index * 60 * 60,
    group: index <= 3 ? 'Today' : 'Yesterday',
  };
});

const { token } = theme.useToken();

// Customize the style of the container
const style = computed(() => ({
  width: '272px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));

const groupable: ConversationsProps['groupable'] = {
  sort(a, b) {
    if (a === b) return 0;

    return a === 'Today' ? -1 : 1;
  },
  title: (group, { components: { GroupTitle } }) =>
    group ? (
      <GroupTitle>
        <Space>
          <CommentOutlined />
          <span>{group}</span>
        </Space>
      </GroupTitle>
    ) : (
      <GroupTitle />
    ),
};

defineRender(() => {
  return (
    <Conversations style={style.value} groupable={groupable} defaultActiveKey="item1" items={items} />
  )
});
</script>
