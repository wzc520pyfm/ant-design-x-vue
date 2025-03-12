<script setup lang="tsx">
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'
import { Prompts, type PromptsProps } from 'ant-design-x-vue'
import { Flex } from 'ant-design-vue';
import { BulbOutlined, InfoCircleOutlined, RocketOutlined } from '@ant-design/icons-vue'

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    label: 'Ignite Your Creativity',
    description: 'Got any sparks for a new project?',
    disabled: false,
  },
  {
    key: '2',
    icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
    label: 'Uncover Background Info',
    description: 'Help me understand the background of this topic.',
    disabled: false,
  },
  {
    key: '3',
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,
    label: 'Efficiency Boost Battle',
    description: 'How can I work faster and better?',
    disabled: false,
  },
];

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
    <Flex vertical>
      <SemanticPreview semantics={[
            { name: 'title', desc: '标题容器' },
            { name: 'list', desc: '列表容器' },
            { name: 'item', desc: '列表项' },
            { name: 'itemContent', desc: '标题项内容' },
          ]}
        >
        {({ classNames }) => {
          return (
            <Prompts classNames={classNames} title="✨ Inspirational Sparks and Marvelous Tips" items={items} />  
            ) 
          }
        }
      </SemanticPreview>
      <SemanticPreview semantics={[
            { name: 'subList', desc: '子列表容器' },
            { name: 'subItem', desc: '子列表项' },
          ]}
        >
        {({ classNames }) => {
          return (
            <Prompts classNames={classNames} title="✨ Nested Prompts" items={nestItems} />   
          ) 
          }
        }
      </SemanticPreview>
    </Flex>
  )
})

</script>
