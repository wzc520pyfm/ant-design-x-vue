<script setup lang="tsx">
import { RedditOutlined } from '@ant-design/icons-vue';
import { Sender, Suggestion, type SuggestionProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSuggestionBasic' });

type SuggestionItems = Exclude<SuggestionProps['items'], () => void>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <RedditOutlined />,
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

const Demo = () => {
  const value = ref('')

  const updateValue = (v: string) => {
    value.value = v
  }

  return (
    <Suggestion
      items={suggestions}
      onSelect={(itemVal) => {
        updateValue(`[${itemVal}]:`);
      }}
      children={({ onTrigger, onKeyDown }) => {
        return (
          <Sender
            value={value.value}
            onChange={(nextVal) => {
              if (nextVal === '/') {
                onTrigger();
              } else if (!nextVal) {
                onTrigger(false);
              }
              updateValue(nextVal);
            }}
            onKeyDown={onKeyDown}
            placeholder="输入 / 获取建议"
          />
        );
      }}
    />
  );
};

defineRender(() => {
  return (
    <Demo />
  )
});
</script>
