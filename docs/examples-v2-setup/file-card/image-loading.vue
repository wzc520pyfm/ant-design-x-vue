<script setup lang="ts">
defineOptions({ name: 'AXFileCardImageLoadingV2Setup' });

import { FileCard } from 'ant-design-x-vue';
import { Button, Flex, Space } from 'ant-design-vue';
import { ref } from 'vue';

const loading = ref(true);
const src = ref('');

const startLoading = () => {
  loading.value = true;
  src.value = '';
};

const loadComplete = () => {
  src.value = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
  setTimeout(() => {
    loading.value = false;
  }, 400);
};
</script>

<template>
  <Flex gap="middle" vertical>
    <Space>
      <Button :disabled="loading" @click="startLoading">Start Loading</Button>
      <Button @click="loadComplete">Load Complete</Button>
    </Space>

    <FileCard
      :loading="loading"
      :styles="{ file: { width: '200px' } }"
      :spin-props="{ size: 'small' }"
      name="image-file.png"
      :src="src ? `${src}?${Date.now()}` : ''"
    />
    <FileCard
      :loading="loading"
      name="image-file.png"
      :src="src ? `${src}?${Date.now()}` : ''"
    />
  </Flex>
</template>
