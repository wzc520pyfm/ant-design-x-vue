<script setup lang="ts">
import { FileCard } from 'ant-design-x-vue';
import type { FileCardListProps } from 'ant-design-x-vue';
import { Flex, Segmented } from 'ant-design-vue';
import { ref } from 'vue';

const images = Array.from({ length: 11 }).map((_, index) => ({
  name: `image-file-${index}.png`,
  src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  byte: 1024,
}));

const files = [
  { name: 'excel-file.xlsx', byte: 1024 },
  { name: 'word-file.docx', byte: 1024 },
  { name: 'pdf-file.pdf', byte: 1024 },
  { name: 'ppt-file.pptx', byte: 1024 },
  { name: 'zip-file.zip', byte: 1024 },
  { name: 'txt-file.txt', byte: 1024 },
];

const allItems = [...images, ...files];

const overflow = ref<FileCardListProps['overflow']>('wrap');

const overflowOptions = [
  { value: 'wrap', label: 'Wrap' },
  { value: 'scrollX', label: 'Scroll X' },
  { value: 'scrollY', label: 'Scroll Y' },
];
</script>

<template>
  <Flex vertical gap="middle">
    <Segmented
      v-model:value="overflow"
      :options="overflowOptions"
      :style="{ marginInlineEnd: 'auto' }"
    />
    <FileCard.List :items="allItems" removable :overflow="overflow" />
  </Flex>
</template>
