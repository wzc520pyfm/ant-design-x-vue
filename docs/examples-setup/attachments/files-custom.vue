<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import { Attachments } from 'ant-design-x-vue';
import { VideoCameraFilled, AudioFilled, CopyFilled, FileImageFilled } from '@ant-design/icons-vue';
import { h } from 'vue';

defineOptions({ name: 'AXAttachmentFiles' });

const fileIcons = [
  {
    icon: h(CopyFilled),
    color: '#8c8c8c',
    ext: ['xlsx', 'xls', 'md', 'mdx', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'zip', 'rar', '7z', 'tar', 'gz'],
  },
  {
    icon: h(FileImageFilled),
    color: '#8c8c8c',
    ext: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'],
  },
  {
    icon: h(VideoCameraFilled),
    color: '#8c8c8c',
    ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
  },
  {
    icon: h(AudioFilled),
    color: '#8c8c8c',
    ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
  },
];

const filesList = [
  {
    uid: '1',
    name: 'excel-file.xlsx',
    size: 111111,
  },
  {
    uid: '2',
    name: 'image-file.png',
    size: 333333,
  },
  {
    uid: '3',
    name: 'pdf-file.pdf',
    size: 444444,
  },
  {
    uid: '4',
    name: 'video-file.mp4',
    size: 666666,
  },
  {
    uid: '5',
    name: 'audio-file.mp3',
    size: 777777,
  },
  {
    uid: '6',
    name: 'markdown-file.md',
    size: 999999,
    description: 'Custom description here',
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
      :file-icons="fileIcons"
    />
  </Flex>
</template>
