<script setup lang="ts">
defineOptions({ name: 'AXBubbleDividerV2Setup' });

import { Bubble } from 'ant-design-x-vue';
</script>

<template>
  <a-flex :gap="16" vertical>
    <Bubble content="message 1" />
    <Bubble.Divider content="Solid" />
    <Bubble content="message 2" placement="end" />
    <Bubble.Divider content="Dashed" :divider-props="{ variant: 'dashed' }" />
    <Bubble content="message 3" />
    <Bubble.Divider content="Dotted" :divider-props="{ variant: 'dotted' }" />
    <Bubble content="message 4" placement="end" />
    <Bubble.Divider content="Plain Text" :divider-props="{ plain: true }" />
    <Bubble content="message 5" />
  </a-flex>
</template>
