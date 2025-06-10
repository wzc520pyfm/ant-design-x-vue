<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import { Attachments } from 'ant-design-x-vue';

defineOptions({ name: 'AXAttachmentFiles' });

const filesList = [
  {
    uid: '1',
    name: 'excel-file.xlsx',
    size: 111111,
  },
  {
    uid: '2',
    name: 'word-file.docx',
    size: 222222,
  },
  {
    uid: '3',
    name: 'image-file.png',
    size: 333333,
  },
  {
    uid: '4',
    name: 'pdf-file.pdf',
    size: 444444,
  },
  {
    uid: '5',
    name: 'ppt-file.pptx',
    size: 555555,
  },
  {
    uid: '6',
    name: 'video-file.mp4',
    size: 666666,
  },
  {
    uid: '7',
    name: 'audio-file.mp3',
    size: 777777,
  },
  {
    uid: '8',
    name: 'zip-file.zip',
    size: 888888,
  },
  {
    uid: '9',
    name: 'markdown-file.md',
    size: 999999,
    description: 'Custom description here',
  },
  {
    uid: '10',
    name: 'image-file.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    size: 123456,
  },
];
</script>

<template>
  <Flex
    vertical
    gap="middle"
  >
    <Attachments.FileCard
      v-for="(file, index) in filesList"
      :key="index"
      :item="file"
    />
  </Flex>
</template>
