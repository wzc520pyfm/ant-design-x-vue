<script setup lang="tsx">
defineOptions({ name: 'AXPromptsDisabledV2' });

import { CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons-vue';
import { Prompts, type PromptsProps } from 'ant-design-x-vue';

const items: PromptsProps['items'] = [
  {
    key: '5',
    icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,
    label: 'Task Completion Secrets',
    description: 'What are some tricks for getting tasks done?',
    disabled: true,
  },
  {
    key: '6',
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
    label: 'Time for a Coffee Break',
    description: 'How to rest effectively after long hours of work?',
  },
];

defineRender(() => (
  <Prompts title="☕️ It's time to relax!" items={items} />
));
</script>
