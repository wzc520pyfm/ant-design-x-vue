<script setup lang="ts">
import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
</script>

<template>
  <Flex vertical gap="middle">
    <FileCard name="pdf-file.pdf" :byte="1024" size="small" />
    <FileCard name="pdf-file.pdf" :byte="1024" size="default" />
  </Flex>
</template>
