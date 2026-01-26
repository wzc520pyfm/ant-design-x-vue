<script setup lang="ts">
import { ref } from 'vue';
import { Bubble } from 'ant-design-x-vue';

type ContentType = {
  imageUrl: string;
  text: string;
  actionNode: string;
};

const content = ref<ContentType>({
  imageUrl:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  text: 'Ant Design X',
  actionNode: 'Click Me',
});

const handleClick = () => {
  content.value = {
    ...content.value,
    actionNode: '🎉 Happy Ant Design X !',
  };
};
</script>

<template>
  <div :style="{ height: '100px' }">
    <Bubble :content="content">
      <template #content="{ content: c }">
        <a-flex gap="middle" align="center">
          <a-image :height="50" :src="(c as ContentType).imageUrl" />
          <span :style="{ fontSize: '18px', fontWeight: 'bold' }">{{ (c as ContentType).text }}</span>
        </a-flex>
      </template>
      <template #footer="{ content: c }">
        <a-button type="text" @click="handleClick">
          {{ (c as ContentType)?.actionNode }}
        </a-button>
      </template>
    </Bubble>
  </div>
</template>
