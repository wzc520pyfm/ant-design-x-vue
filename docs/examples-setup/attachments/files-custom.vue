<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import { Attachments } from 'ant-design-x-vue';
import { RobotOutlined, VideoCameraFilled, AudioFilled, CopyFilled, FileImageFilled } from '@ant-design/icons-vue';
import { h } from 'vue';
import type { VNode } from 'vue';

defineOptions({ name: 'AXAttachmentFiles' });
const filesList: {
    uid: string;
    name: string;
    size: number;
    description?: string;
    thumbUrl?: string;
    url?: string;
    icon?: VNode;
    type?: 'file' | 'image';
  }[] = [
    {
      uid: '1',
      name: 'excel-file.xlsx',
      size: 111111,
      icon: h(RobotOutlined, { style: { color: 'rgb(250, 183, 20)' } }),
      type: 'file',
    },
    {
      uid: '2',
      name: 'image-file.png',
      size: 333333,
      icon: h(FileImageFilled, { style: { color: 'rgb(22, 119, 255)' } }),
      type: 'file',
    },
    {
      uid: '3',
      name: 'pdf-file.pdf',
      size: 444444,
      icon: h(CopyFilled, { style: { color: 'rgb(140, 140, 140)' } }),
      type: 'file',
    },
    {
      uid: '4',
      name: 'video-file.mp4',
      size: 666666,
      icon: h(VideoCameraFilled, { style: { color: 'rgb(255, 77, 79)' } }),
      type: 'file',
    },
    {
      uid: '5',
      name: 'audio-file.mp3',
      size: 777777,
      icon: h(AudioFilled, { style: { color: 'rgb(255, 110, 49)' } }),
      type: 'file',
    },
    {
      uid: '6',
      name: 'image name without file ext',
      size: 888888,
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      type: 'image',
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
      :icon="file.icon"
      :type="file.type"
    />
  </Flex>
</template>
