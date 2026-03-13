<script setup lang="tsx">
import { CoffeeOutlined, FireOutlined, SmileOutlined } from '@ant-design/icons-vue';
import { Prompts, type PromptsProps } from 'ant-design-x-vue';

const items: PromptsProps['items'] = [
  {
    key: '6',
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
    description: 'How to rest effectively after long hours of work?',
    disabled: false,
  },
  {
    key: '7',
    icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
    description: 'What are the secrets to maintaining a positive mindset?',
    disabled: false,
  },
  {
    key: '8',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    description: 'How to stay calm under immense pressure?',
    disabled: false,
  },
];

defineRender(() => (
  <Prompts title="🤔 You might also want to ask:" items={items} vertical />
));
</script>
