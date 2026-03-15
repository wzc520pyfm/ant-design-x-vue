<script setup lang="tsx">
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Card } from 'ant-design-vue';

const items: ThoughtChainProps['items'] = [
  {
    title: 'Knowledge Query',
    description: 'Query knowledge base',
  },
  {
    title: 'Web Search Tool Invoked',
    description: 'Tool invocation',
  },
  {
    title: 'Model Invocation Complete',
    description: 'Invoke model for response',
  },
  {
    title: 'Response Complete',
    description: 'Task completed',
    blink: true,
  },
];

defineRender(() => (
  <Card style={{ width: '500px' }}>
    <ThoughtChain items={items} />
  </Card>
));
</script>
