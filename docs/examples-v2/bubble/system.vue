<script setup lang="tsx">
import { Bubble } from 'ant-design-x-vue';
import { Flex, Space, Typography } from 'ant-design-vue';

const text = `Hello, this is a system message`;

defineRender(() => (
  <Flex gap={16} vertical>
    <Bubble.System content={text} />
    <Bubble.System
      variant="outlined"
      shape="round"
      content={
        <Space>
          {text}
          <Typography.Link>ok</Typography.Link>
        </Space>
      }
    />
    <Bubble.System
      variant="borderless"
      content={
        <Space>
          {text}
          <Typography.Link>cancel</Typography.Link>
        </Space>
      }
    />
  </Flex>
));
</script>
