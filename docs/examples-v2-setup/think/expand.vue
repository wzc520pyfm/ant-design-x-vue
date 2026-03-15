<script setup lang="ts">
defineOptions({ name: 'AXThinkExpandV2Setup' });

import { Button } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

const value = ref(true);
</script>

<template>
  <div>
    <Button @click="value = !value">
      Change expand
    </Button>
  </div>
  <br>
  <Think
    title="deep thinking"
    :expanded="value"
    @expand="(val: boolean) => { value = val; }"
  >
    This is deep thinking content.
  </Think>
</template>
