<script setup lang="tsx">
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Button, Card } from 'ant-design-vue';

const items: ThoughtChainProps['items'] = [
  {
    title: '1 - Thought Chain Item',
    description: 'description',
    footer: <Button>1 - Thought Chain Item Footer</Button>,
    content: (
      <ThoughtChain
        items={[
          { title: '1-1 Thought Chain Item', description: 'description' },
          { title: '1-2 Thought Chain Item', description: 'description' },
        ]}
      />
    ),
  },
  {
    title: '2 - Thought Chain Item',
    description: 'description',
    footer: <Button>2 - Thought Chain Item Footer</Button>,
    content: (
      <ThoughtChain
        items={[
          { title: '2-1 Thought Chain Item', description: 'description' },
          { title: '2-2 Thought Chain Item', description: 'description' },
          { title: '2-3 Thought Chain Item', description: 'description' },
        ]}
      />
    ),
  },
];

defineRender(() => (
  <Card style={{ width: '500px' }}>
    <ThoughtChain items={items} />
  </Card>
));
</script>
