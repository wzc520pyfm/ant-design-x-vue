<script setup lang="tsx">
import { CodeOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Button, Card, Flex, Typography } from 'ant-design-vue';
import { ref } from 'vue';

const { Text } = Typography;

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Develop New Component',
    description: 'Execute files needed for new component creation',
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
        <Text type="secondary">Creating Chinese documentation file</Text>
        <Text type="secondary">Creating English description file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Continue creating file"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
    status: 'success',
  },
  {
    key: 'check_task',
    title: 'Check Task Execution Steps Completion',
    collapsible: true,
    description: 'Verify the overall task execution logic and feasibility',
    content: (
      <Flex gap="small" vertical>
        <ThoughtChain.Item variant="solid" status="success" title="Folder created" description="component" />
        <ThoughtChain.Item variant="solid" status="success" title="File created" description="component/index.tsx" />
        <ThoughtChain.Item variant="solid" status="success" title="File created" description="component/index.zh-CN.md" />
        <ThoughtChain.Item variant="solid" status="success" title="File created" description="component/index.en-US.md" />
      </Flex>
    ),
    status: 'success',
  },
  {
    key: 'used_task',
    title: 'Using the New Component',
    description: 'Using the generated component to complete the task',
    content: (
      <Flex gap="small" vertical>
        <ThoughtChain.Item variant="solid" status="success" title="File created" description="component" />
      </Flex>
    ),
    status: 'loading',
  },
];

const expandedKeys = ref(['create_task']);

defineRender(() => (
  <Card style={{ width: '500px' }}>
    <Button
      style={{ marginBottom: '16px' }}
      onClick={() => {
        expandedKeys.value = ['check_task'];
      }}
    >
      Open "check_task" details
    </Button>
    <ThoughtChain
      items={items}
      expandedKeys={expandedKeys.value}
      onExpand={(keys) => { expandedKeys.value = keys; }}
    />
  </Card>
));
</script>
