<script setup lang="tsx">
import { CopyOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Avatar, Flex, Tooltip } from 'ant-design-vue';

defineRender(() => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="align left"
          avatar={
            <Tooltip title="main side">
              <Avatar icon={<UserOutlined />} />
            </Tooltip>
          }
          extra={
            <Tooltip title="extra side">
              <CopyOutlined />
            </Tooltip>
          }
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="align right"
          placement="end"
          avatar={
            <Tooltip title="main side">
              <Avatar icon={<UserOutlined />} />
            </Tooltip>
          }
          extra={
            <Tooltip title="extra side">
              <CopyOutlined />
            </Tooltip>
          }
        />
      </div>
    </Flex>
  </Flex>
));
</script>
