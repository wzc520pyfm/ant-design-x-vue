<script setup lang="tsx">
import { Prompts, type PromptsProps } from 'ant-design-x-vue'

const {classNames} = defineProps<{
  classNames: PromptsProps['classNames']
}>()

const nestItems: PromptsProps['items'] = [
  {
    key: '1',
    label: '🔥 Ignite Your Creativity',
    children: [
      {
        key: '1-1',
        description: 'What sparks your creativity?',
      },
      {
        key: '1-2',
        description: 'How do you get inspired?',
      },
    ],
  },
  {
    key: '2',
    label: '🎨 Uncover Background Info',
    children: [
      {
        key: '2-1',
        description: 'What is the background of this topic?',
      },
      {
        key: '2-2',
        description: 'Why is this important?',
      },
    ],
  },
];

defineRender(() => {
  return (
    <Prompts classNames={classNames} title="✨ Nested Prompts" items={nestItems} />
  )
})

</script>
