<script setup lang="ts">
import { Sender, Suggestion, type SuggestionProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSuggestionBlockSetup' });

type SuggestionItems = Exclude<SuggestionProps['items'], () => void>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    extra: 'Extra Info',
  },
];

const value = ref('');
</script>
<template>
  <Suggestion
    :items="suggestions"
    block
    @select="(itemVal) => {
      value = `[${itemVal}]:`;
    }"
  >
    <template #default="{ onTrigger, onKeyDown }">
      <Sender
        :value="value"
        :on-change="(nextVal) => {
          if (nextVal === '/') {
            onTrigger();
          } else if (!nextVal) {
            onTrigger(false);
          }
          value = nextVal;
        }"
        :on-keydown="onKeyDown"
        placeholder="输入 / 获取建议"
      />
    </template>
  </Suggestion>
</template>
