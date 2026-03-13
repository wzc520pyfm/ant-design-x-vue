<script setup lang="tsx">
defineOptions({ name: 'AXBubbleHeaderV2' });

import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Avatar, Flex } from 'ant-design-vue';

defineRender(() => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble content="align left" header="header" avatar={<Avatar icon={<UserOutlined />} />} />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="align right"
          placement="end"
          header="header"
          avatar={<Avatar icon={<UserOutlined />} />}
        />
      </div>
    </Flex>
  </Flex>
));
</script>
