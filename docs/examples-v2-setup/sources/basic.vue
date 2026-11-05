<script setup lang="ts">
defineOptions({ name: 'AXSourcesBasicV2Setup' });

import { Sources } from 'ant-design-x-vue';

const items = [
  {
    title: '1. Data source',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '2. Data source',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '3. Data source',
    url: 'https://x.ant.design/components/overview',
  },
];
</script>

<template>
  <Sources title="Used 3 sources" :items="items" />
</template>
