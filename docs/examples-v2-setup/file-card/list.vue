<script setup lang="ts">
defineOptions({ name: 'AXFileCardListV2Setup' });

import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

const files = [
  { name: 'excel-file.xlsx', byte: 1024 },
  { name: 'word-file.docx', byte: 1024 },
  { name: 'pdf-file.pdf', byte: 1024 },
  { name: 'ppt-file.pptx', byte: 1024 },
  { name: 'zip-file.zip', byte: 1024 },
  { name: 'txt-file.txt', byte: 1024 },
];

const imageItems = new Array(6).fill({
  name: 'image-file.png',
  src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
});

const largeImageItems = new Array(3).fill({
  name: 'image-file.png',
  src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
});
</script>

<template>
  <Flex vertical gap="middle" :style="{ width: '900px' }">
    <FileCard.List :items="files" removable />
    <FileCard.List :items="files" removable size="small" />
    <FileCard.List :items="imageItems" />
    <FileCard.List
      :styles="{ file: { width: '230px', height: '230px' } }"
      :items="largeImageItems"
    />
  </Flex>
</template>
