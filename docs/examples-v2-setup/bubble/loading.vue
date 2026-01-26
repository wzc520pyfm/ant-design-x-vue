<script setup lang="ts">
import { ref } from 'vue';
import { Bubble } from 'ant-design-x-vue';

const loading = ref(true);
</script>

<template>
  <a-flex gap="large" vertical>
    <Bubble :loading="loading" content="hello world !" />
    <a-flex gap="large" wrap>
      Loading state:
      <a-switch v-model:checked="loading" />
    </a-flex>
  </a-flex>
</template>
