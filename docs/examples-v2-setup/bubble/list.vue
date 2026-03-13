<script setup lang="ts">
defineOptions({ name: 'AXBubbleListV2Setup' });

import { ref, computed, onMounted } from 'vue';
import {
  AntDesignOutlined,
  CopyOutlined,
  CheckOutlined,
  EditOutlined,
  LinkOutlined,
  RedoOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Bubble, Actions, FileCard, type BubbleItemType, type RoleType, type FileCardProps } from 'ant-design-x-vue';

const actionItems = [
  {
    key: 'retry',
    icon: RedoOutlined,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: CopyOutlined,
    label: 'Copy',
  },
];

let id = 0;
const getKey = () => `bubble_${id++}`;

const genItem = (isAI: boolean, config?: Partial<BubbleItemType>): BubbleItemType => ({
  key: getKey(),
  role: isAI ? 'ai' : 'user',
  content: `${id} : ${isAI ? 'Mock AI content'.repeat(50) : 'Mock user content.'}`,
  ...config,
});

const items = ref<BubbleItemType[]>([]);

onMounted(() => {
  items.value = [
    { key: getKey(), role: 'system', content: 'Welcome to use Ant Design X' },
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    { key: getKey(), role: 'divider', content: 'divider' },
    genItem(false, { typing: false }),
    genItem(true, { typing: false, loading: true }),
  ];
});

const roles = computed<RoleType>(() => ({
  ai: {
    typing: true,
  },
  user: {
    placement: 'end',
    typing: false,
  },
}));

const addBubble = () => {
  const chatItems = items.value.filter((item) => item.role === 'ai' || item.role === 'user');
  const isAI = !!(chatItems.length % 2);
  items.value = [...items.value, genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } })];
};

const addMarkdownMsg = () => {
  items.value = [
    ...items.value,
    {
      key: getKey(),
      role: 'ai',
      typing: { effect: 'fade-in', step: 6 },
      content: text,
    },
  ];
};

const addDivider = () => {
  items.value = [...items.value, { key: getKey(), role: 'divider', content: 'Divider' }];
};

const addSystem = () => {
  items.value = [...items.value, { key: getKey(), role: 'system', content: 'This is a system message' }];
};

const listRef = ref<InstanceType<typeof Bubble.List> | null>(null);

const addToPre = () => {
  const item = genItem(false);
  items.value = [item, genItem(true), genItem(false), ...items.value];
  setTimeout(() => {
    listRef.value?.scrollTo({ key: item.key });
  }, 0);
};

const addWithRef = () => {
  items.value = [
    ...items.value,
    {
      key: getKey(),
      role: 'reference',
      placement: 'end',
      content: { name: 'Ant-Design-X.pdf' },
    } as any,
    genItem(false),
  ];
};
</script>

<template>
  <a-flex vertical :style="{ height: '720px' }" :gap="20">
    <a-flex gap="small">
      <a-button type="primary" @click="addBubble">Add Bubble</a-button>
      <a-button @click="addMarkdownMsg">Add Markdown Msg</a-button>
      <a-button @click="addDivider">Add Divider</a-button>
      <a-button @click="addSystem">Add System</a-button>
      <a-button @click="addToPre">Add To Pre</a-button>
      <a-button @click="addWithRef">Add With Ref</a-button>
    </a-flex>
    <Bubble.List ref="listRef" :roles="roles" :items="items">
      <template #avatar="{ item }">
        <a-avatar>
          <template #icon>
            <AntDesignOutlined v-if="item.role === 'ai'" />
            <UserOutlined v-else />
          </template>
        </a-avatar>
      </template>
      <template #header="{ item }">
        {{ item.role === 'ai' ? 'AI' : `User-${item.key}` }}
      </template>
      <template #footer="{ item }">
        <Actions v-if="item.role === 'ai'" :items="actionItems" @click="console.log(item)" />
      </template>
    </Bubble.List>
  </a-flex>
</template>
