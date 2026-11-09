<script setup lang="ts">
defineOptions({ name: 'AXSenderAutofocusV2Setup' });

import { Sender } from 'ant-design-x-vue';
</script>

<template>
  <Sender
    autofocus
    placeholder="Automatically focused after mounting"
  />
</template>
