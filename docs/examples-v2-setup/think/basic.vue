<script setup lang="ts">
defineOptions({ name: 'AXThinkBasicV2Setup' });
</script>

<template>
  <Think title="deep thinking">
    This is deep thinking content.
  </Think>
</template>

<script lang="ts">
import { Think } from 'ant-design-x-vue';

export default {
  components: { Think },
};
</script>
