<script setup lang="ts">
defineOptions({ name: 'AXBubbleVariantAndShapeV2Setup' });

import { Bubble } from 'ant-design-x-vue';
</script>

<template>
  <a-flex vertical gap="small" class="ax-bubble-variants">
    <a-flex gap="small" wrap class="ax-bubble-variant-row">
      <Bubble content="filled - default" />
      <Bubble content="filled - round" shape="round" />
      <Bubble content="filled - corner left" shape="corner" />
      <Bubble content="filled - corner right" shape="corner" placement="end" />
    </a-flex>
    <a-flex gap="small" wrap class="ax-bubble-variant-row">
      <Bubble content="outlined - default" variant="outlined" />
      <Bubble content="outlined - round" variant="outlined" shape="round" />
      <Bubble content="outlined - corner left" variant="outlined" shape="corner" />
      <Bubble content="outlined - corner right" variant="outlined" shape="corner" placement="end" />
    </a-flex>
    <a-flex gap="small" wrap class="ax-bubble-variant-row">
      <Bubble content="shadow - default" variant="shadow" />
      <Bubble content="shadow - round" variant="shadow" shape="round" />
      <Bubble content="shadow - corner left" variant="shadow" shape="corner" />
      <Bubble content="shadow - corner right" variant="shadow" shape="corner" placement="end" />
    </a-flex>
    <a-flex gap="small" wrap class="ax-bubble-variant-row" :style="{ marginTop: '8px' }">
      <Bubble variant="borderless">
        <template #content>
          <span>borderless bubble</span>
        </template>
      </Bubble>
    </a-flex>
  </a-flex>
</template>

<style>
.ax-bubble-variants .ant-bubble {
  flex: 0 0 auto;
  max-width: 100%;
}

.ax-bubble-variants .ant-bubble-content {
  white-space: nowrap;
  overflow-wrap: normal;
  word-break: keep-all;
}

@media (max-width: 640px) {
  .ax-bubble-variants .ax-bubble-variant-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
