<script setup lang="tsx">
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainBasic' });

const items: ThoughtChainProps['items'] = [
  {
    title: 'Thought Chain Item Title',
    description: 'Description of the thought chain item',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },
  {
    title: 'Visible tooltip： Thought Chain Item Title',
    description: 'Description of the thought chain item',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    tooltip: true,
  },
  {
    title: 'Thought Chain Item Title',
    description: 'Description of the thought chain item',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    tooltip: {
      titleConfig: {
        title: 'Custom title tooltip',
      },
      descriptionConfig: {
        title: 'Custom description tooltip',
      },
    },
  },
  {
    title: 'Hidden description tooltip',
    description: 'Description of the thought chain item',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    tooltip: {
      descriptionConfig: {
        open: false,
        title: 'This text does not display the description tooltip',
      },
    },
  },
];

defineRender(() => {
  return (
    <Card style={{ width: '250px' }}>
      <ThoughtChain items={items} />
    </Card>
  );
});
</script>
