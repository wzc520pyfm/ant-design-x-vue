<script setup lang="tsx">
defineOptions({ name: 'AXSuggestionBlockV2' });

import { Sender, Suggestion, type SuggestionProps } from 'ant-design-x-vue';
import { ref } from 'vue';

type SuggestionItems = Exclude<SuggestionProps['items'], (...args: any[]) => any>;

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

defineRender(() => (
  <Suggestion
    items={suggestions}
    onSelect={(itemVal) => {
      value.value = `[${itemVal}]:`;
    }}
    block
    children={({ onTrigger, onKeyDown }) => (
      <Sender
        value={value.value}
        onChange={(nextVal) => {
          if (nextVal === '/') {
            onTrigger();
          } else if (!nextVal) {
            onTrigger(false);
          }
          value.value = nextVal;
        }}
        onKeyDown={onKeyDown}
        placeholder="输入 / 获取建议"
      />
    )}
  />
));
</script>
