<script setup lang="tsx">
import { EditOutlined, GlobalOutlined, SearchOutlined, ChromeOutlined } from '@ant-design/icons-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Flex, Typography } from 'ant-design-vue';

const { Text } = Typography;

const onClick = () => {
  console.log('Item Click');
};

defineRender(() => (
  <Flex vertical gap="middle">
    <Flex gap="small" wrap align="center">
      <Text>loading status:</Text>
      <ThoughtChain.Item variant="solid" status="loading" title="Tool Calling" />
      <ThoughtChain.Item variant="outlined" status="loading" title="Tool Calling" />
      <ThoughtChain.Item variant="text" status="loading" title="Tool Calling" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>success status:</Text>
      <ThoughtChain.Item variant="solid" status="success" title="Tool Call Finished" />
      <ThoughtChain.Item variant="outlined" status="success" title="Tool Call Finished" />
      <ThoughtChain.Item variant="text" status="success" title="Tool Call Finished" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>error status:</Text>
      <ThoughtChain.Item variant="solid" status="error" title="Tool Call Error" />
      <ThoughtChain.Item variant="outlined" status="error" title="Tool Call Error" />
      <ThoughtChain.Item variant="text" status="error" title="Tool Call Error" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>abort status:</Text>
      <ThoughtChain.Item variant="solid" status="abort" title="Agent Response Aborted" />
      <ThoughtChain.Item variant="outlined" status="abort" title="Agent Response Aborted" />
      <ThoughtChain.Item variant="text" status="abort" title="Agent Response Aborted" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>custom icon:</Text>
      <ThoughtChain.Item variant="solid" icon={<ChromeOutlined />} title="Task Completed" />
      <ThoughtChain.Item variant="outlined" icon={<ChromeOutlined />} title="Task Completed" />
      <ThoughtChain.Item variant="text" icon={<ChromeOutlined />} title="Task Completed" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>description & click:</Text>
      <ThoughtChain.Item
        variant="solid"
        onClick={onClick}
        icon={<GlobalOutlined />}
        title="Opening Webpage"
        description="https://x.ant.design/docs/playground/copilot"
      />
      <ThoughtChain.Item
        variant="outlined"
        onClick={onClick}
        icon={<EditOutlined />}
        title="Creating"
        description="todo.md"
      />
      <ThoughtChain.Item
        variant="text"
        onClick={onClick}
        icon={<SearchOutlined />}
        title="Searching"
        description="Route Information"
      />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>blink:</Text>
      <ThoughtChain.Item blink variant="solid" icon={<ChromeOutlined />} title="Task Completed" />
      <ThoughtChain.Item blink variant="outlined" icon={<ChromeOutlined />} title="Task Completed" />
      <ThoughtChain.Item
        blink
        variant="text"
        icon={<ChromeOutlined />}
        title="Task Completed"
        description="Route Information"
      />
    </Flex>
  </Flex>
));
</script>
