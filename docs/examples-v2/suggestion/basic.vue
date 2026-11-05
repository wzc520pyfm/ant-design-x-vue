<script setup lang="tsx">
defineOptions({ name: 'AXSuggestionBasicV2' });

import { ChromeOutlined } from '@ant-design/icons-vue';
import { Sender, Suggestion, type SuggestionProps } from 'ant-design-x-vue';
import { ref } from 'vue';

type SuggestionItems = Exclude<SuggestionProps['items'], (...args: any[]) => any>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <ChromeOutlined />,
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
];

const value = ref('');

defineRender(() => (
  <Suggestion
    items={suggestions}
    onSelect={(itemVal) => {
      value.value = `[${itemVal}]:`;
    }}
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
