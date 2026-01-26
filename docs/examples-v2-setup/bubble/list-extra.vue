<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bubble, Actions, type BubbleItemType, type RoleType } from 'ant-design-x-vue';

const items = ref<BubbleItemType[]>([
  {
    status: 'success',
    key: 'welcome',
    role: 'ai',
    variant: 'borderless',
    content: 'Mock welcome content. '.repeat(10),
    extraInfo: {
      feedback: 'like',
    },
  },
  {
    key: 'ask',
    role: 'user',
    content: 'Mock user content.',
  },
  {
    key: 'ai_0',
    role: 'ai',
    status: 'success',
    variant: 'borderless',
    content: 'Mock welcome content. '.repeat(10),
    extraInfo: {
      feedback: 'dislike',
    },
  },
  {
    key: 'user_1',
    role: 'user',
    content: 'Mock user content.',
  },
  {
    key: 'ai_3',
    role: 'ai',
    status: 'loading',
    loading: true,
    content: '',
  },
]);

const roles = computed<RoleType>(() => ({
  ai: {
    placement: 'start',
    typing: (_, { status }) =>
      status === 'updating' ? { effect: 'typing', step: 5, interval: 20 } : false,
  },
  user: {
    placement: 'end',
  },
}));

const handleFeedback = (key: string | number) => {
  items.value = items.value.map((message) => {
    if (message.key === key) {
      const currentFeedback = message.extraInfo?.feedback;
      const newFeedback = currentFeedback === 'like' ? 'dislike' : 'like';
      return { ...message, extraInfo: { feedback: newFeedback } };
    }
    return message;
  });
};
</script>

<template>
  <Bubble.List :style="{ height: '500px' }" :roles="roles" :items="items">
    <template #footer="{ item }">
      <Actions
        v-if="item.role === 'ai'"
        :items="[
          { key: 'copy', label: 'copy' },
          { key: 'feedback', label: item.extraInfo?.feedback === 'like' ? '👍' : item.extraInfo?.feedback === 'dislike' ? '👎' : '🤔' },
        ]"
        @click="({ key }: { key: string }) => key === 'feedback' && handleFeedback(item.key)"
      />
    </template>
    <template #loading>
      <a-flex align="center" gap="small">
        <a-spin size="small" />
        Custom loading...
      </a-flex>
    </template>
  </Bubble.List>
</template>
