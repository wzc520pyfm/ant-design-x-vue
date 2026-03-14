<script setup lang="ts">
defineOptions({ name: 'AXSourcesExpandV2Setup' });

import { Sources } from 'ant-design-x-vue';
import { Button } from 'ant-design-vue';
import { ref } from 'vue';

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

const expanded = ref(true);
</script>

<template>
  <Button :style="{ marginBottom: '8px' }" @click="expanded = !expanded">
    Change expand
  </Button>
  <br>
  <Sources
    title="Used 3 sources"
    :items="items"
    :expanded="expanded"
    :on-expand="(val: boolean) => { expanded = val }"
  />
</template>
