<script setup lang="ts">
defineOptions({ name: 'AXFileCardIconV2Setup' });

import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { AndroidOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

const iconNode = h(AndroidOutlined, { style: { fontSize: '36px', color: '#22b35e' } });
</script>

<template>
  <Flex vertical gap="middle">
    <FileCard icon="pdf" name="txt-file.txt" :byte="1024" />
    <FileCard
      :icon="iconNode"
      name="android-file.apk"
      :byte="1024"
    />
  </Flex>
</template>
