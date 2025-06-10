<script setup lang="ts">
import { CommentOutlined } from '@ant-design/icons-vue';
import { Space, theme } from 'ant-design-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { computed, h } from 'vue';

defineOptions({ name: 'AXConversationsGroupSortSetup' });


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
    group ? h(
      GroupTitle,
      null,
      () => [h(Space, null, () => [h(CommentOutlined), h('span', null, group)])]
    ) : h(GroupTitle),
};
</script>
<template>
  <Conversations
    :style="style"
    :groupable="groupable"
    default-active-key="item1"
    :items="items"
  />
</template>
