<script setup lang="ts">
defineOptions({ name: 'AXSuggestionBasicV2Setup' });

import { ChromeOutlined } from '@ant-design/icons-vue';
import { Sender, Suggestion, type SuggestionProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

type SuggestionItems = Exclude<SuggestionProps['items'], (...args: any[]) => any>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: h(ChromeOutlined),
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
];

const value = ref('');

const onSelect = (itemVal: string) => {
  value.value = `[${itemVal}]:`;
};

const onChange = (nextVal: string, onTrigger: (info?: any) => void) => {
  if (nextVal === '/') {
    onTrigger();
  } else if (!nextVal) {
    onTrigger(false);
  }
  value.value = nextVal;
};
</script>

<template>
  <Suggestion
    :items="suggestions"
    @select="onSelect"
  >
    <template #default="{ onTrigger, onKeyDown }">
      <Sender
        :value="value"
        placeholder="输入 / 获取建议"
        @change="(nextVal: string) => onChange(nextVal, onTrigger)"
        @keydown="onKeyDown"
      />
    </template>
  </Suggestion>
</template>
