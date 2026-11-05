<script setup lang="ts">
defineOptions({ name: 'AXThinkDestroyOnHiddenV2Setup' });

import { Button, Space, Switch } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

const expanded = ref(true);
const destroyOnHidden = ref(true);
</script>

<template>
  <Space direction="vertical" :size="16">
    <Space>
      <Button @click="expanded = !expanded">
        {{ expanded ? 'Collapse' : 'Expand' }}
      </Button>
      <Switch
        v-model:checked="destroyOnHidden"
        checked-children="destroyOnHidden"
        un-checked-children="keep"
      />
    </Space>
    <Think
      title="Deep Thinking"
      :expanded="expanded"
      :destroy-on-hidden="destroyOnHidden"
      @expand="(val: boolean) => { expanded = val; }"
    >
      This content will be removed from DOM when collapsed and destroyOnHidden is true.
    </Think>
  </Space>
</template>
