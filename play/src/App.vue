<script setup lang="tsx">
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainBasic' });

const items: ThoughtChainProps['items'] = [
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    tooltip: {
      titleConfig: {
        title: '自定义 Tooltip 标题',
      },
      descriptionConfig: {
        title: '自定义 Tooltip 副标题',
      },
    },
  },
  {
    title: '配置不显示 description',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    tooltip: {
      descriptionConfig: {
        open: false,
        title: '配置不显示 description ',
      },
    },
  },
  {
    title: '隐藏 tooltip',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    // 设置不显示 tooltip
    tooltip: false,
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
