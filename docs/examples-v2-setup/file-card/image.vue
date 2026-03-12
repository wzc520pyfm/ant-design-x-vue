<script setup lang="ts">
import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
</script>

<template>
  <Flex vertical gap="middle">
    <FileCard
      name="image-file.png"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
    <FileCard
      :styles="{ file: { width: '100px', height: '100px' } }"
      name="image-file.png"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
    <FileCard
      type="file"
      name="image-file.png"
      :byte="1024"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </Flex>
</template>
