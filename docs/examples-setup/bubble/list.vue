<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { BubbleList } from 'ant-design-x-vue';
import { Button, Flex, Switch } from 'ant-design-vue';
import type { BubbleListProps, BubbleProps } from 'ant-design-x-vue';
import type { SwitchProps } from 'ant-design-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXBubbleListSetup' });

const rolesAsObject: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: h(UserOutlined), style: { background: '#87d068' } },
  },
};

const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
  const RenderIndex: BubbleProps['messageRender'] = (content) =>
    h(Flex, null, () => [h('text', null, `#${index}: ${content}`)]);
    switch (bubbleData.role) {
    case 'ai':
      return {
        placement: 'start' as const,
        avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
        typing: { step: 5, interval: 20 },
        style: {
          maxWidth: 600,
        },
        messageRender: RenderIndex,
      };
    case 'user':
      return {
        placement: 'end' as const,
        avatar: { icon: h(UserOutlined), style: { background: '#87d068' } },
        messageRender: RenderIndex,
      };
    default:
      return { messageRender: RenderIndex };
  }
};

const count = ref<number>(3);
const useRolesAsFunction = ref(false);

// const listRef = useTemplateRef<InstanceType<typeof BubbleList>>(null);
const listRef = ref<InstanceType<typeof BubbleList>>(null);

const handleChange = (checked: SwitchProps['checked']) => {
  useRolesAsFunction.value = checked as boolean;
};
</script>

<template>
  <Flex vertical gap="small">
    <Flex gap="large" align="center">
      Use roles as:
      <Switch
        :checked="useRolesAsFunction"
        @change="handleChange"
        checkedChildren="Function"
        unCheckedChildren="Object"
      />
    </Flex>

    <Flex gap="small" :style="{ alignSelf: 'flex-end' }">
      <Button
        @click="
          () => {
            count++;
          }
        "
      >
        Add Bubble
      </Button>

      <Button
        @click="
          () => {
            listRef?.scrollTo({ key: 0, block: 'nearest' });
          }
        "
      >
        Scroll To First
      </Button>
    </Flex>

    <BubbleList
      ref="listRef"
      :style="{ maxHeight: '300px', paddingInline: '16px' }"
      :roles="useRolesAsFunction ? rolesAsFunction : rolesAsObject"
      :items="
        Array.from({ length: count }).map((_, i) => {
          const isAI = !!(i % 2);
          const content = isAI
            ? 'Mock AI content. '.repeat(20)
            : 'Mock user content.';

          return {
            key: i,
            role: isAI ? 'ai' : 'user',
            content,
          };
        })
      "
    />
  </Flex>
</template>
