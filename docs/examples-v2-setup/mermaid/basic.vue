<script setup lang="ts">
defineOptions({ name: 'AXMermaidBasicV2Setup' });
</script>

<template>
  <Mermaid>
    {{ `graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作A]
    B -->|否| D[执行操作B]
    C --> E[结束]
    D --> E` }}
  </Mermaid>
</template>

<script lang="ts">
import { Mermaid } from 'ant-design-x-vue';

export default {
  components: { Mermaid },
};
</script>
