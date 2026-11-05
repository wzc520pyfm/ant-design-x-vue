<script setup lang="ts">
defineOptions({ name: 'AXSuggestionTriggerV2Setup' });

import { Suggestion } from 'ant-design-x-vue';
import { Select } from 'ant-design-vue';
import { ref } from 'vue';

let uuid = 0;
const tags = ref<string[]>([]);
const value = ref('');

const onSuggestionSelect = (info: string) => {
  uuid += 1;
  tags.value = [...tags.value, `Cell_${uuid}`];
  value.value = value.value.replace(info, '');
};
</script>

<template>
  <Suggestion
    :items="(info: string) => [{ label: `Trigger by '${info}'`, value: String(info) }]"
    @select="onSuggestionSelect"
  >
    <template #default="{ onTrigger, onKeyDown }">
      <Select
        :value="tags"
        :style="{ width: '100%' }"
        mode="tags"
        :open="false"
        :search-value="value"
        placeholder="可任意输入 / 与 # 多次获取建议"
        @change="(nextTags: string[]) => {
          if (nextTags.length < tags.length) {
            tags = nextTags;
          }
        }"
        @search="(nextVal: string) => { value = nextVal; }"
        @keydown="(e: KeyboardEvent) => {
          if (e.key === '/' || e.key === '#') {
            onTrigger(e.key);
          }
          onKeyDown(e);
        }"
      />
    </template>
  </Suggestion>
</template>
