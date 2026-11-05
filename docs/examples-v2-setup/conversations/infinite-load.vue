<script setup lang="ts">
defineOptions({ name: 'AXConversationsInfiniteLoadV2Setup' });

import { ref, onMounted, h } from 'vue';
import { RedoOutlined } from '@ant-design/icons-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { theme } from 'ant-design-vue';

type ConversationItem = NonNullable<ConversationsProps['items']>[number];

const loading = ref(false);
const data = ref<ConversationItem[]>([]);
const hasMore = ref(true);

const { token } = theme.useToken();

const loadMoreData = () => {
  if (loading.value) return;
  loading.value = true;
  fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
    .then((res) => res.json())
    .then((body) => {
      const formatted: ConversationItem[] = body.results.map((i: any) => ({
        key: i.email,
        label: `${i.name.title} ${i.name.first} ${i.name.last}`,
        icon: h('a-avatar', { src: i.picture.thumbnail }),
        group: i.nat,
      }));
      data.value = [...data.value, ...formatted];
      if (data.value.length >= 50) hasMore.value = false;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
    if (hasMore.value && !loading.value) {
      loadMoreData();
    }
  }
};

onMounted(() => {
  loadMoreData();
});
</script>

<template>
  <div
    :style="{
      width: '280px',
      height: '600px',
      background: token.colorBgContainer,
      borderRadius: `${token.borderRadius}px`,
      overflow: 'auto',
    }"
    @scroll="onScroll"
  >
    <Conversations :items="data" default-active-key="demo1" groupable />
    <div v-if="loading" :style="{ textAlign: 'center', padding: '8px' }">
      <a-spin size="small">
        <template #indicator>
          <RedoOutlined spin />
        </template>
      </a-spin>
    </div>
    <a-divider v-if="!hasMore" plain>It is all, nothing more</a-divider>
  </div>
</template>
