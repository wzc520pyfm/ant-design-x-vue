<script setup lang="tsx">
import { CodeOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Card, Flex, Typography } from 'ant-design-vue';

const { Text } = Typography;

const contentStyles = {
  backgroundColor: 'rgba(0,0,0,.01)',
  borderRadius: '8px',
  padding: '10px',
  marginBlockStart: '10px',
  border: '1px solid rgba(0,0,0,.04)',
};

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Write New Component',
    icon: false,
    collapsible: true,
    content: (
      <Flex gap="small" vertical>
        <Text type="secondary">Creating folder for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<CodeOutlined />}
          title="Executing command"
          description="mkdir -p component"
        />
        <Text type="secondary">Creating files needed for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Creating file"
          description="component/index.tsx"
        />
        <Text type="secondary">Creating Chinese description file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Creating file"
          description="component/index.zh-CN.md"
        />
        <Text type="secondary">Creating English description file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Creating file"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
  },
];

defineRender(() => (
  <Card style={{ width: '500px' }}>
    <ThoughtChain
      styles={{ itemContent: contentStyles }}
      defaultExpandedKeys={['create_task']}
      items={items}
    />
  </Card>
));
</script>
