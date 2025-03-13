<script setup lang="ts">
import { RedditOutlined } from '@ant-design/icons-vue';
import { Sender, Suggestion, type SuggestionProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXSuggestionBasicSetup' });

type SuggestionItems = Exclude<SuggestionProps['items'], () => void>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: h(RedditOutlined, { displayName: '' }),
    children: [
      {
        label: 'About React',
        value: 'react',
      },
      {
        label: 'About Ant Design',
        value: 'antd',
      },
    ],
  },
];

const value = ref('')

const updateValue = (v: string) => {
  value.value = v
}


</script>
<template>
  <Suggestion
    :items="suggestions"
    @select="(itemVal) => {
      updateValue(`[${itemVal}]:`);
    }"
  >
    <template #default="{ onTrigger, onKeyDown }">
      <Sender
        :value="value"
        @change="(nextVal) => {
          if (nextVal === '/') {
            onTrigger();
          } else if (!nextVal) {
            onTrigger(false);
          }
          updateValue(nextVal);
        }"
        @keydown="onKeyDown"
        placeholder="输入 / 获取建议"
      />
    </template>
  </Suggestion>
</template>
