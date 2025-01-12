<script setup lang="tsx">
import { CheckCircleOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card, Typography } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, type ThoughtChainProps } from 'ant-design-x-vue';
import { cloneVNode, isVNode } from 'vue';

defineOptions({ name: 'AXThoughtChainCustomization' });

const { Paragraph, Text } = Typography;

const customizationProps: ThoughtChainItem = {
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  extra: <Button type="text" icon={<MoreOutlined />} />,
  footer: <Button block>Thought Chain Item Footer</Button>,
  content: (
    <Typography>
      <Paragraph>
        In the process of internal desktop applications development, many different design specs and
        implementations would be involved, which might cause designers and developers difficulties
        and duplication and reduce the efficiency of development.
      </Paragraph>
      <Paragraph>
        After massive project practice and summaries, Ant Design, a design language for background
        applications, is refined by Ant UED Team, which aims to{' '}
        <Text strong>
          uniform the user interface specs for internal background projects, lower the unnecessary
          cost of design differences and implementation and liberate the resources of design and
          front-end development
        </Text>
      </Paragraph>
    </Typography>
  ),
};

const cloneCustomizationProps = (op: ThoughtChainItem) => {
  return Object.fromEntries(Object.entries(op).map(([k, v]) => {
    return [k, isVNode(v) ? cloneVNode(v): v];
  }));
}

const items: ThoughtChainProps['items'] = [
  {
    ...cloneCustomizationProps(customizationProps),
    status: 'success',
  },
  {
    ...cloneCustomizationProps(customizationProps),
    status: 'error',
  },
  {
    ...cloneCustomizationProps(customizationProps),
    status: 'pending',
  },
];

defineRender(() => {
  return (
    <Card style={{ width: '500px' }}>
      <ThoughtChain items={items} />
    </Card>
  )
})
</script>
