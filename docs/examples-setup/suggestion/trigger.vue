<script setup lang="ts">
import { Select } from 'ant-design-vue';
import { Suggestion } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSuggestionTriggerSetup' });

const uuid = ref(0);
const tags = ref<string[]>([]);
const value = ref('');
</script>
<template>
  <Suggestion
    :items="(info) => [{ label: `Trigger by '${info}'`, value: String(info) }]"
    @select="(info) => {
      uuid += 1;
      tags = [...tags, `Cell_${uuid}`];
      value = value.replace(info, '');
    }"
  >
    <template #default="{ onTrigger, onKeyDown }">
      <Select
        :value="tags"
        :style="{ width: '100%' }"
        mode="tags"
        :open="false"
        :search-value="value"
        placeholder="可任意输入 / 与 # 多次获取建议"
        @change="(nextTags) => {
          if ((nextTags as string[]).length < tags.length) {
            tags = nextTags as string[];
          }
        }"
        @search="(nextVal) => {
          value = nextVal;
        }"
        @keydown="(e) => {
          if (e.key === '/' || e.key === '#') {
            onTrigger(e.key);
          }
          onKeyDown(e);
        }"
      />
    </template>
  </Suggestion>
</template>
