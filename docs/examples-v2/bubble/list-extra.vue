<script setup lang="tsx">
defineOptions({ name: 'AXBubbleListExtraV2' });

import { ref, computed } from 'vue';
import { Bubble, Actions, type BubbleItemType, type RoleType } from 'ant-design-x-vue';
import { Flex, Spin } from 'ant-design-vue';

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
    key: 'ai_1',
    role: 'ai',
    variant: 'borderless',
    status: 'success',
    content: 'Mock welcome content. '.repeat(10),
    extraInfo: {
      feedback: 'dislike',
    },
  },
  {
    key: 'user_2',
    role: 'user',
    content: 'Mock user content.',
  },
  {
    key: 'ai_2',
    role: 'ai',
    variant: 'borderless',
    status: 'success',
    content: 'Mock welcome content. '.repeat(10),
    extraInfo: {
      feedback: 'like',
    },
  },
  {
    key: 'user_3',
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
    footer: (content, { key, extraInfo }) => (
      <Actions
        items={[
          {
            key: 'copy',
            label: 'copy',
          },
          {
            key: 'feedback',
            label: extraInfo?.feedback === 'like' ? '👍' : extraInfo?.feedback === 'dislike' ? '👎' : '🤔',
          },
        ]}
        onClick={({ key: actionKey }) => {
          if (actionKey === 'feedback') {
            items.value = items.value.map((message) => {
              if (message.key === key) {
                const currentFeedback = message.extraInfo?.feedback;
                const newFeedback = currentFeedback === 'like' ? 'dislike' : 'like';
                return { ...message, extraInfo: { feedback: newFeedback } };
              }
              return message;
            });
          }
        }}
      />
    ),
    loadingRender: () => (
      <Flex align="center" gap="small">
        <Spin size="small" />
        Custom loading...
      </Flex>
    ),
  },
  user: {
    placement: 'end',
  },
}));

defineRender(() => (
  <Bubble.List style={{ height: '500px' }} roles={roles.value} items={items.value} />
));
</script>
