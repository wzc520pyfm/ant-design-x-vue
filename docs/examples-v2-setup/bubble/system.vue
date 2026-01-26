<script setup lang="ts">
import { Bubble } from 'ant-design-x-vue';

const text = `Hello, this is a system message`;
</script>

<template>
  <a-flex :gap="16" vertical>
    <Bubble.System :content="text" />
    <Bubble.System variant="outlined" shape="round">
      <template #content>
        <a-space>
          {{ text }}
          <a-typography-link>ok</a-typography-link>
        </a-space>
      </template>
    </Bubble.System>
    <Bubble.System variant="borderless">
      <template #content>
        <a-space>
          {{ text }}
          <a-typography-link>cancel</a-typography-link>
        </a-space>
      </template>
    </Bubble.System>
  </a-flex>
</template>
