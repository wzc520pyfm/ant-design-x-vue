<script setup lang="tsx">
defineOptions({ name: 'AXBubbleFooterV2' });

import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar, Flex } from 'ant-design-vue';

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

defineRender(() => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="outer footer"
          header="footer"
          avatar={<Avatar icon={<UserOutlined />} />}
          footer={(content) => <Actions items={actionItems} onClick={() => console.log(content)} />}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="inner footer"
          placement="end"
          footerPlacement="inner-end"
          header="footer"
          avatar={<Avatar icon={<UserOutlined />} />}
          footer={(content) => <Actions items={actionItems} onClick={() => console.log(content)} />}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="outer footer and align right"
          footerPlacement="outer-end"
          header="footer"
          avatar={<Avatar icon={<UserOutlined />} />}
          footer={(content) => <Actions items={actionItems} onClick={() => console.log(content)} />}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="inner footer and align left"
          placement="end"
          footerPlacement="inner-start"
          header="footer"
          avatar={<Avatar icon={<UserOutlined />} />}
          footer={(content) => <Actions items={actionItems} onClick={() => console.log(content)} />}
        />
      </div>
    </Flex>
  </Flex>
));
</script>
