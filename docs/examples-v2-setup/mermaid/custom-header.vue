<script setup lang="ts">
import { h } from 'vue';
import { Button, Space } from 'ant-design-vue';

defineOptions({ name: 'AXMermaidCustomHeaderV2Setup' });

const header = h(
  'div',
  {
    style: {
      padding: '12px 16px',
      border: '1px solid #f0f0f0',
      borderBottom: 'none',
      borderRadius: '8px 8px 0 0',
      backgroundColor: '#fafafa',
    },
  },
  [
    h(Space, { size: 'middle' }, () => [
      h('span', { style: { fontWeight: 500, color: '#1a1a1a' } }, 'Login Flow'),
      h(Button, { type: 'primary', size: 'small' }, () => 'Export'),
      h(Button, { size: 'small' }, () => 'Reset'),
    ]),
  ],
);
</script>

<template>
  <div style="padding: 24px">
    <Mermaid :header="header">
      {{ `flowchart LR
    A[User Login] --> B{Validate}
    B -->|Success| C[System Entry]
    B -->|Failed| D[Error Message]
    C --> E[Dashboard]
    D --> A` }}
    </Mermaid>
  </div>
</template>

<script lang="ts">
import { Mermaid } from 'ant-design-x-vue';

export default {
  components: { Mermaid },
};
</script>
