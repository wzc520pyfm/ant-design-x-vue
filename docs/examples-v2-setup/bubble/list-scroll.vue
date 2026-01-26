<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AntDesignOutlined, CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions, type BubbleItemType, type RoleType, type BubbleListRef } from 'ant-design-x-vue';

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

const listRef = ref<InstanceType<typeof Bubble.List> | null>(null);
const items = ref<BubbleItemType[]>([]);

onMounted(() => {
  items.value = [
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
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

const handleScroll = (e: Event) => {
  console.log('scroll', (e.target as HTMLDivElement).scrollTop);
};
</script>

<template>
  <a-flex vertical :style="{ height: '720px' }" gap="small">
    <a-flex gap="small" justify="space-between">
      <a-flex gap="small">
        <a-button type="primary" @click="console.log(listRef?.nativeElement)">Get Dom</a-button>
        <a-button @click="listRef?.scrollTo({ top: 'top' })">Scroll To Top</a-button>
        <a-button @click="listRef?.scrollTo({ top: 'bottom', behavior: 'smooth' })">Scroll To Bottom</a-button>
        <a-button @click="listRef?.scrollTo({ top: Math.random() * 1000 })">Scroll To Random</a-button>
        <a-button @click="listRef?.scrollTo({ key: items[1]?.key, block: 'nearest' })">Scroll To Second</a-button>
      </a-flex>
    </a-flex>

    <Bubble.List ref="listRef" :roles="roles" :items="items" @scroll="handleScroll">
      <template #avatar="{ item }">
        <a-avatar>
          <template #icon>
            <AntDesignOutlined v-if="item.role === 'ai'" />
            <UserOutlined v-else />
          </template>
        </a-avatar>
      </template>
      <template #header="{ item }">
        {{ item.role === 'ai' ? 'AI' : 'User' }}
      </template>
      <template #footer="{ item }">
        <Actions v-if="item.role === 'ai'" :items="actionItems" @click="console.log(item)" />
      </template>
    </Bubble.List>
  </a-flex>
</template>
